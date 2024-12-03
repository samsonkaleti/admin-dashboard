const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

// Start a new chat session
router.post("/start", async (req, res) => {
  try {
    const response = await chatController.startChat(req);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ask a question in a chat
router.post("/ask", async (req, res) => {
  try {
    const response = await chatController.askQuestion(req);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get chat history
router.get("/:chatId/history", async (req, res) => {
  try {
    const response = await chatController.getChatHistory(req);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
