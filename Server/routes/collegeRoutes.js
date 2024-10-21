const express = require('express');
const collegeController = require('../controllers/collegeController'); // Adjust the path as necessary
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Colleges
 *   description: API to manage colleges
 */

/**
 * @swagger
 * /api/colleges:
 *   post:
 *     summary: Create a new college
 *     tags: [Colleges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collegeName:
 *                 type: string
 *               regulatoryBody:
 *                 type: string
 *               domain:
 *                 type: string
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     contactNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *               programs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     specializations:
 *                       type: array
 *                       items:
 *                         type: string
 *                     years:
 *                       type: array
 *                       items:
 *                         type: number
 *                     regulations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           regulation:
 *                             type: string
 *                           validYears:
 *                             type: array
 *                             items:
 *                               type: number
 *     responses:
 *       200:
 *         description: College created successfully
 *       500:
 *         description: Error creating college
 */
router.post('/colleges', collegeController.createCollege);

/**
 * @swagger
 * /api/colleges:
 *   get:
 *     summary: Get all colleges
 *     tags: [Colleges]
 *     responses:
 *       200:
 *         description: A list of colleges
 *       500:
 *         description: Error fetching colleges
 */
router.get('/colleges', collegeController.getAllColleges);

/**
 * @swagger
 * /api/colleges/{id}:
 *   get:
 *     summary: Get a college by ID
 *     tags: [Colleges]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: College ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: College details
 *       404:
 *         description: College not found
 *       500:
 *         description: Error fetching college
 */
router.get('/colleges/:id', collegeController.getCollegeById);

/**
 * @swagger
 * /api/colleges/{id}:
 *   put:
 *     summary: Update a college by ID
 *     tags: [Colleges]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: College ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collegeName:
 *                 type: string
 *               regulatoryBody:
 *                 type: string
 *               domain:
 *                 type: string
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     contactNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *               programs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     specializations:
 *                       type: array
 *                       items:
 *                         type: string
 *                     years:
 *                       type: array
 *                       items:
 *                         type: number
 *                     regulations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           regulation:
 *                             type: string
 *                           validYears:
 *                             type: array
 *                             items:
 *                               type: number
 *     responses:
 *       200:
 *         description: College updated successfully
 *       404:
 *         description: College not found
 *       500:
 *         description: Error updating college
 */
router.put('/colleges/:id', collegeController.updateCollegeById);

/**
 * @swagger
 * /colleges/{id}:
 *   delete:
 *     summary: Delete a college by ID
 *     tags: [Colleges]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: College ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: College deleted successfully
 *       404:
 *         description: College not found
 *       500:
 *         description: Error deleting college
 */
router.delete('/colleges/:id', collegeController.deleteCollegeById);

module.exports = router;
