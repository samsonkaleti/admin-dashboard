const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController'); 
const uploadMiddleware = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: PDFs
 *   description: PDF management API endpoints
 * 
 * components:
 *   schemas:
 *     PDF:
 *       type: object
 *       required:
 *         - id
 *         - academicYear
 *         - regulation
 *         - course
 *         - subject
 *         - fileName
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the PDF
 *         academicYear:
 *           type: object
 *           properties:
 *             year:
 *               type: string
 *               enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
 *             semester:
 *               type: string
 *               enum: ['1st Semester', '2nd Semester']
 *         regulation:
 *           type: string
 *           enum: ['R20', 'R21']
 *         course:
 *           type: string
 *         subject:
 *           type: string
 *         fileName:
 *           type: string
 *         uploadDate:
 *           type: string
 *           format: date-time
 *   responses:
 *     BadRequest:
 *       description: Invalid input or validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
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
 *             required:
 *               - file
 *               - academicYear.year
 *               - academicYear.semester
 *               - regulation
 *               - course
 *               - subject
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload (max 5MB)
 *               academicYear.year:
 *                 type: string
 *                 enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
 *                 description: Academic year
 *               academicYear.semester:
 *                 type: string
 *                 enum: ['1st Semester', '2nd Semester']
 *                 description: Semester
 *               regulation:
 *                 type: string
 *                 enum: ['R20', 'R21']
 *                 description: Regulation code
 *               course:
 *                 type: string
 *                 description: Course name
 *               subject:
 *                 type: string
 *                 description: Subject name
 *     responses:
 *       201:
 *         description: PDF uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pdf:
 *                   $ref: '#/components/schemas/PDF'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', uploadMiddleware, pdfController.createPdf);

/**
 * @swagger
 * /api/pdfs:
 *   get:
 *     summary: Get all PDFs
 *     tags: [PDFs]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *           enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
 *         description: Filter by academic year
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *           enum: ['1st Semester', '2nd Semester']
 *         description: Filter by semester
 *       - in: query
 *         name: regulation
 *         schema:
 *           type: string
 *           enum: ['R20', 'R21']
 *         description: Filter by regulation
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course
 *     responses:
 *       200:
 *         description: List of PDFs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PDF'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', pdfController.getAllPdfs);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   put:
 *     summary: Update a PDF
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: PDF ID
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
 *                 description: New PDF file (optional)
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
 *       200:
 *         description: PDF updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pdf:
 *                   $ref: '#/components/schemas/PDF'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', uploadMiddleware, pdfController.updatePdfById);

/**
 * @swagger
 * /api/pdfs/{id}:
 *   delete:
 *     summary: Delete a PDF
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: PDF ID to delete
 *     responses:
 *       200:
 *         description: PDF deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', pdfController.deletePdfById);

/**
 * @swagger
 * /api/pdfs/download/{id}:
 *   get:
 *     summary: Download a PDF file
 *     tags: [PDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: PDF ID to download
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/download/:id', pdfController.downloadPdf);

module.exports = router;