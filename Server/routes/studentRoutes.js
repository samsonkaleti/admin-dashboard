const express = require("express");
const studentController = require("../controllers/studentController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API to manage students
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students
 *       500:
 *         description: Error fetching students
 */
router.get("/students", studentController.getAllStudents);

/**
 * @swagger
 * /api/events/register:
 *   post:
 *     summary: Register student for an event
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student successfully registered for the event
 *       400:
 *         description: Student already registered or other validation error
 *       500:
 *         description: Error registering student for event
 */
router.post("/events/register", studentController.registerStudentForEvent);

module.exports = router;
