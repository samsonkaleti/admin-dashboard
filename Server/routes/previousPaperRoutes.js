const express = require("express");
const router = express.Router();
const previousPaperController = require("../controllers/previousPaperController");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, previousPaperController.getAllPreviousPapers);

router.post("/", authMiddleware, uploadMiddleware, previousPaperController.createPreviousPapers);

// Implement other routes (PUT, DELETE, download) similarly to pdfRoutes

module.exports = router;

