const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

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
 *               file:
 *                 type: string
 *                 format: binary
 *               year:
 *                 type: string
 *               course:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: PDF uploaded successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', upload.single('file'), pdfController.createPdf);

/**
 * @swagger
 * /api/pdfs:
 *   get:
 *     summary: Get all PDFs
 *     tags: [PDFs]
 *     responses:
 *       200:
 *         description: List of all PDFs
 *       500:
 *         description: Server error
 */
router.get('/', pdfController.getAllPdfs);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   put:
 *     summary: Update a PDF
 *     tags: [PDFs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               year:
 *                 type: string
 *               course:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: PDF updated successfully
 *       404:
 *         description: PDF not found
 *       500:
 *         description: Server error
 */
router.put('/:id', upload.single('file'), pdfController.updatePdfById);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   delete:
 *     summary: Delete a PDF
 *     tags: [PDFs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: PDF deleted successfully
 *       404:
 *         description: PDF not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', pdfController.deletePdfById);

/**
 * @swagger
 * /api/pdfs/download/{id}:
 *   get:
 *     summary: Download a PDF
 *     tags: [PDFs]
 *     parameters:
 *       - name: id
 *         in: path
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
 *       404:
 *         description: PDF not found
 *       500:
 *         description: Server error
 */
router.get('/download/:id', pdfController.downloadPdf); 

module.exports = router;