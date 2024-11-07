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

module.exports = router;
