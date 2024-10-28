const express = require('express');
const pdfController = require('../controllers/pdfController'); // Adjust the path as necessary
const multer = require('multer');
const upload = multer(); // Initialize multer to handle file uploads
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PDFs
 *   description: API to manage PDF uploads
 */

/**
 * @swagger
 * /api/pdfs:
 *   post:
 *     summary: Upload a new PDF
 *     tags: [PDFs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               year:
 *                 type: number
 *               course:
 *                 type: string
 *               subject:
 *                 type: string
 *               fileName:
 *                 type: string
 *               pdfFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: PDF uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading PDF
 */
router.post('/', upload.single('pdfFile'), pdfController.createPdf);

/**
 * @swagger
 * /api/pdfs:
 *   get:
 *     summary: Get all uploaded PDFs
 *     tags: [PDFs]
 *     responses:
 *       200:
 *         description: A list of uploaded PDFs
 *       500:
 *         description: Error fetching PDFs
 */
router.get('/', pdfController.getAllPdfs);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   get:
 *     summary: Get a PDF by ID
 *     tags: [PDFs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: PDF ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: PDF details
 *       404:
 *         description: PDF not found
 *       500:
 *         description: Error fetching PDF
 */
router.get('/:id', pdfController.getPdfById);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   put:
 *     summary: Update a PDF by ID
 *     tags: [PDFs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: PDF ID
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: number
 *               course:
 *                 type: string
 *               subject:
 *                 type: string
 *               fileName:
 *                 type: string
 *               pdfFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF updated successfully
 *       404:
 *         description: PDF not found
 *       500:
 *         description: Error updating PDF
 */
router.put('/:id', upload.single('pdfFile'), pdfController.updatePdfById);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   delete:
 *     summary: Delete a PDF by ID
 *     tags: [PDFs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: PDF ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: PDF deleted successfully
 *       404:
 *         description: PDF not found
 *       500:
 *         description: Error deleting PDF
 */
router.delete('/:id', pdfController.deletePdfById);

module.exports = router;
