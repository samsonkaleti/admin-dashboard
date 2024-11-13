const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

/**
 * @swagger
 * /api/pdfs:
 *   post:
 *     summary: Upload multiple PDFs
 *     tags: [PDFs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *               - academicYear.year
 *               - academicYear.semester
 *               - regulation
 *               - course
 *               - subject
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: PDF files to upload (max 10 files, 5MB each)
 *               academicYear.year:
 *                 type: string
 *                 enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
 *               academicYear.semester:
 *                 type: string
 *                 enum: ['1st Semester', '2nd Semester']
 *               regulation:
 *                 type: string
 *                 enum: ['R20', 'R21']
 *               course:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: PDFs uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pdf:
 *                   $ref: '#/components/schemas/PDF'
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Uploader"),
  uploadMiddleware,
  pdfController.createPdfs
);

/**
 * @swagger
 * /api/pdfs:
 *   get:
 *     summary: Get all PDF documents
 *     tags: [PDFs]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Filter by academic year
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *         description: Filter by semester
 *     responses:
 *       200:
 *         description: List of PDF documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PDF'
 */
router.get(
  "/", // Ensure this is the correct route path
  authMiddleware,
  authorizeRoles("Admin", "Uploader", "Student"),
  pdfController.getAllPdfs
);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   put:
 *     summary: Update a PDF document
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               academicYear.year:
 *                 type: string
 *               academicYear.semester:
 *                 type: string
 *               regulation:
 *                 type: string
 *               course:
 *                 type: string
 *               subject:
 *                 type: string
 *
 */
router.put(
  "/:id",

  authorizeRoles("Admin", "Uploader"),
  uploadMiddleware,
  pdfController.updatePdfById
);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   delete:
 *     summary: Delete a PDF document
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 */
router.delete(
  "/:id",

  authorizeRoles("Admin"),
  pdfController.deletePdfById
);

/**
 * @swagger
 * /api/pdfs/download/{id}/{fileIndex}:
 *   get:
 *     summary: Download a specific PDF file
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: fileIndex
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  "/download/:id/:fileIndex",

  authorizeRoles("Admin", "Uploader", "Student"),
  pdfController.downloadPdf
);

/**
 * @swagger
 * /api/pdfs/download-all/{id}:
 *   get:
 *     summary: Download all PDFs for a document as ZIP
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: ZIP file containing all PDFs
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  "/download-all/:id",

  authorizeRoles("Admin", "Uploader"),
  pdfController.downloadAllPdfs
);

module.exports = router;
