const Chat = require("../models/Chat");
const { loadFaissIndex } = require("../utils/faissUtils");

// Correct import and initialization for OpenAI SDK v4.x.x
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatController = {
  // Start a new chat session
  startChat: async ({ body }) => {
    const { year, semester, subject, unit } = body;
    if (!year || !semester || !subject || !unit) {
      throw new Error("Year, semester, subject, and unit are required to start a chat.");
    }

    const chat = new Chat({ year, semester, subject, unit, messages: [] });
    await chat.save();
    return { chatId: chat._id, subject, unit };
  },

  // Handle user questions
  askQuestion: async ({ body }) => {
    const { chatId, question } = body;
    if (!chatId || !question) {
      throw new Error("Chat ID and question are required.");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat session not found.");
    }

    // Add user question to chat history
    chat.messages.push({ role: "user", message: question });
    await chat.save();

    // Load FAISS index
    const faissIndex = await loadFaissIndex(chat.year, chat.semester, chat.subject, chat.unit);
    if (!faissIndex) {
      throw new Error("No data available for the selected subject/unit.");
    }

    // Generate embedding for the question
    const queryEmbedding = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: question,
    });

    // Perform similarity search
    const results = faissIndex.search([queryEmbedding.data[0].embedding], 3);

    // Retrieve response based on results
    const retriever = faissIndex.asRetriever();
    const response = await retriever.retrieve(question);

    // Add system response to chat history
    chat.messages.push({ role: "system", message: response });
    await chat.save();

    return { response };
  },

  // Fetch chat history
  getChatHistory: async ({ params }) => {
    const { chatId } = params;
    if (!chatId) {
      throw new Error("Chat ID is required to fetch chat history.");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat session not found.");
    }

    return { chatId, messages: chat.messages };
  },
};

module.exports = chatController;
