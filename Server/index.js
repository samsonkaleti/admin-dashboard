// server.js
const collegeRoutes = require("./routes/collegeRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const cardRoutes = require("./routes/cardRoute");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const regulationRoutes = require("./routes/regulationRoutes");
const userRoutes = require("./routes/usersRoutes");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { swaggerUi, swaggerSpecs } = require("./swagger/swagger");
const connectDB = require("./config/db"); // Import MongoDB connection
const logger = require("./config/logger"); // Import logger
const { requestLogger, ipLogger } = require("./middleware/requestLogger"); // Import request logger middleware
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URL(s)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware to parse URL-encoded form data
// app.use(express.urlencoded({ extended: false }));
// app.use(upload.any());
app.use(bodyParser.json());
// Middleware to parse JSON
app.options("*", cors());
app.use(express.json());
connectDB();

// Use the request logger middleware
app.use(requestLogger);
app.use(ipLogger);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Your routes will be here
app.use("/api/auth", authRoutes);
app.use("/api", collegeRoutes);
app.use("/api", cardRoutes);
app.use("/api", studentRoutes);
app.use("/api/regulations", regulationRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api", userRoutes);
// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// Log unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);
});

// Log uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
});
