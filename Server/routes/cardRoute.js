const express = require('express');
const cardController = require('../controllers/cardController'); // Adjust the path as necessary
const router = express.Router();

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: A list of cards
 *       500:
 *         description: Error fetching cards
 */
router.get('/cards', cardController.getAllCards);


/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get Card by ID
 *     tags: [Card]
 *     responses:
 *       200:
 *         description: A card is returned
 *       500:
 *         description: Error fetching card
 */
router.get('/cards/:id', cardController.getCardById);


/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: The card was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       500:
 *         description: Some server error
 */
router.post('/cards', cardController.createCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card by id
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: The card was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: The card was not found
 *       500:
 *         description: Some error happened
 */
router.put('/cards/:id', cardController.updateCardById);

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Remove the card by id
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *     responses:
 *       200:
 *         description: The card was deleted
 *       404:
 *         description: The card was not found
 */
router.delete('/cards/:id', cardController.deleteCardById);

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the card
 *         title:
 *           type: string
 *           description: The card title
 *         description:
 *           type: string
 *           description: The card description
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the card was added
 *       example:
 *         id: d5fE_asz
 *         title: New Task
 *         description: Implement new feature
 *         createdAt: 2023-06-20T03:24:00
 */

module.exports = router;