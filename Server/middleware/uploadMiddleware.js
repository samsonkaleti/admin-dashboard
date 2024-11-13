const multer = require("multer");

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
}).array("files", 10); // Changed to array upload with max 10 files

// Wrapper to handle multer errors
const uploadMiddleware = (req, res, next) => {
  uploadPdf(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle specific Multer errors
      let errorMessage = "File upload failed";

      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          errorMessage = "File size exceeds 5MB limit";
          break;
        case "LIMIT_FILE_COUNT":
          errorMessage = "Too many files. Maximum 10 files allowed";
          break;
        case "LIMIT_UNEXPECTED_FILE":
          errorMessage = "Unexpected field name for files";
          break;
      }

      return res.status(400).json({
        error: errorMessage,
        code: err.code,
      });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    // Validate that at least one file was uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Please upload at least one PDF file",
        code: "NO_FILES_UPLOADED",
      });
    }

    // Everything went fine
    next();
  });
};

module.exports = uploadMiddleware;
