const OpenAIApi = require("openai");
const similarity = require("similarity");
const pdfController = require("./pdfController");
const { extractPdfText } = require("../utils/pdfUtils");
const Chat = require("../models/Chat");

const openai = new OpenAIApi.OpenAI({
  key: process.env.OPENAI_API_KEY,
});

const chatController = {
  // Start a new chat session or retrieve an existing one
  startChat: async ({ body }) => {
    const regulation = "R20";
    const units = "1st unit";
    const { year, semester, subject, userId } = body;

    if (!year || !semester || !subject || !units || !userId) {
      throw new Error(
        "Year, semester, subject, units, and user ID are required to start a chat."
      );
    }

    try {
      const existingChat = await Chat.findOne({
        "subjectDetails.year": year,
        "subjectDetails.semester": semester,
        "subjectDetails.subject": subject,
        "subjectDetails.units": { $all: [units] },
        participants: userId,
      });

      if (existingChat) {
        return {
          chatId: existingChat._id,
          subject,
          units,
          existingChat: true,
        };
      }

      const mockReq = { query: { year, semester, subject, units } };
      const mockRes = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
      };

      // Fetch PDFs using pdfController
      await pdfController.getAllPdfs(mockReq, mockRes);

      if (mockRes.statusCode !== 200 || !mockRes.data) {
        throw new Error("Failed to fetch PDFs");
      }

      const pdfs = mockRes.data;

      // Extract relevantPdfs
      const relevantPdfs = pdfs
        .flatMap((pdf) => pdf.files)
        .filter((file) => file.fileName && file.filePath)
        .map((file) => ({
          name: file.fileName,
          fileData: file.filePath, // Use filePath as a reference to fetch the actual file
        }));

      if (relevantPdfs.length === 0) {
        throw new Error("No valid PDFs available for the chat.");
      }

      const chat = new Chat({
        participants: [userId],
        subjectDetails: { year, semester, subject, units, regulation },
        messages: [],
        relevantPdfs,
      });

      await chat.save();

      return { chatId: chat._id, subject, units, existingChat: false };
    } catch (error) {
      console.error("Error starting chat:", error.message);
      throw new Error("Failed to start chat.");
    }
  },

  // Handle user questions
  askQuestion: async ({ body }) => {
    const { chatId, question } = body;
    if (!chatId || !question) {
      throw new Error("Chat ID and question are required.");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat session not found.");

    const pdfs = chat.relevantPdfs;
    const pdfTextChunks = [];

    // Fetch text from each PDF using its file path
    for (const pdf of pdfs) {
      const filePath = pdf.fileData; // fileData stores filePath in this case
      const fileBuffer = await pdfController.fetchPdfBuffer(filePath); // Fetch file buffer from the server

      if (!fileBuffer) {
        console.warn(`Failed to fetch PDF at path: ${filePath}`);
        continue;
      }

      const text = await extractPdfText(fileBuffer);
      pdfTextChunks.push(...text.split("\n\n")); // Chunk text
    }

    // Vectorize text chunks using OpenAI embeddings
    const embeddings = await Promise.all(
      pdfTextChunks.map(async (chunk) => {
        const response = await openai.createEmbedding({
          input: chunk,
          model: "text-embedding-ada-002",
        });
        return { embedding: response.data.data[0].embedding, chunk };
      })
    );

    // Vectorize the question
    const questionEmbeddingResponse = await openai.createEmbedding({
      input: question,
      model: "text-embedding-ada-002",
    });
    const questionVector = questionEmbeddingResponse.data.data[0].embedding;

    // Compute similarity scores
    const scores = embeddings.map(({ embedding, chunk }) => ({
      chunk,
      score: similarity(embedding, questionVector),
    }));

    // Sort chunks by relevance and get the top 3
    const topChunks = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.chunk);

    const relevantContext = topChunks.join("\n\n");

    // Include chat history for continuity
    const chatHistory = chat.messages
      .filter((message) => message.isBot === false) // Include only user questions
      .map((message) => `User: ${message.content}`)
      .join("\n");

    // Prepare full context for the AI model
    const context = `${chatHistory}\n\nRelevant Context:\n${relevantContext}`;

    // Send context and question to ChatGPT
    const chatGptResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = chatGptResponse.data.choices[0].message.content;

    // Save chat history with user question and bot response
    chat.messages.push({
      sender: chat.participants[0],
      content: question,
      isBot: false,
    });
    chat.messages.push({ sender: null, content: answer, isBot: true });
    await chat.save();

    return { response: answer };
  },

  // Fetch chat history
  getChatHistory: async ({ params }) => {
    const { chatId } = params;
    if (!chatId) throw new Error("Chat ID is required.");

    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat session not found.");

    return { chatId, messages: chat.messages };
  },
};

module.exports = chatController;
