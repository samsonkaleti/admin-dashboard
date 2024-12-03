const OpenAIApi = require('openai');
const similarity = require("similarity"); // Node.js friendly similarity library
const pdfController = require("./pdfController");
const { extractPdfText } = require("../utils/pdfUtils");
const Chat = require("../models/Chat");

const openai = new OpenAIApi.OpenAI(
  {
    key: process.env.OPENAI_API_KEY
  }
);

const chatController = {
  // Start a new chat session
  startChat: async ({ body }) => {
    const { year, semester, subject, units } = body;
    if (!year || !semester || !subject || !units) {
      throw new Error("Year, semester, subject, and units are required to start a chat.");
    }

    try {
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
      if (mockRes.statusCode !== 200) throw new Error("Failed to fetch PDFs");

      const pdfs = mockRes.data;
      if (pdfs.length === 0) throw new Error("No relevant PDFs found.");

      const chat = new Chat({ year, semester, subject, units, messages: [], relevantPdfs: pdfs });
      await chat.save();

      return { chatId: chat._id, subject, units };
    } catch (error) {
      console.error("Error starting chat:", error);
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

    // Extract text from PDFs
    for (const pdf of pdfs) {
      const buffer = Buffer.from(pdf.fileData, "base64");
      const text = await extractPdfText(buffer);
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

    // Send context and question to ChatGPT
    const chatGptResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Context:\n${relevantContext}\n\nQuestion: ${question}` },
      ],
    });

    const answer = chatGptResponse.data.choices[0].message.content;

    // Save chat history
    chat.messages.push({ role: "user", message: question });
    chat.messages.push({ role: "system", message: answer });
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
