const express = require("express");

const {
  validateCreateExpense,
  validateUpdateExpense,
} = require("../middleware/expenseValidation");

const {
  fetchExpenses,
  fetchExpenseById,
  createExpenseData,
  updateExpenseData,
  deleteExpenseData,
} = require("../controllers/gatewayController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management APIs
 */

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses
 *     description: |
 *       Returns expenses belonging to the authenticated user.
 *
 *       Supports:
 *       - Pagination
 *       - Search
 *       - Category filtering
 *       - Sorting
 *       - Ascending/descending order
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of expenses per page
 *         example: 10
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search expenses by supported searchable fields
 *         example: UPI
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter expenses by category
 *         example: Food
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - date
 *             - amount
 *         description: Field used for sorting
 *         example: amount
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sorting order
 *         example: desc
 *
 *     responses:
 *       200:
 *         description: Expenses fetched successfully
 *
 *       401:
 *         description: Invalid or expired JWT token
 *
 *       500:
 *         description: Failed to fetch expenses
 */
router.get("/", fetchExpenses);


/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     description: Returns a specific expense belonging to the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB expense ID
 *         example: 6a7eb5c4af4f9b17897e0ac5
 *
 *     responses:
 *       200:
 *         description: Expense fetched successfully
 *
 *       401:
 *         description: Invalid or expired JWT token
 *
 *       404:
 *         description: Expense not found
 *
 *       500:
 *         description: Failed to fetch expense
 */
router.get("/:id", fetchExpenseById);


/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     description: Creates a new expense for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - category
 *               - paymentMethod
 *               - date
 *
 *             properties:
 *               title:
 *                 type: string
 *                 description: Expense title
 *                 example: Dinner
 *
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Expense amount
 *                 example: 450
 *
 *               category:
 *                 type: string
 *                 description: Expense category
 *                 example: Food
 *
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method used
 *                 example: UPI
 *
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Expense date
 *                 example: 2026-08-14
 *
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *                 example: Dinner with friends
 *
 *     responses:
 *       201:
 *         description: Expense created successfully
 *
 *       400:
 *         description: Validation failed or invalid expense data
 *
 *       401:
 *         description: Invalid or expired JWT token
 *
 *       500:
 *         description: Failed to create expense
 */
router.post(
  "/",
  validateCreateExpense,
  createExpenseData
);


/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an existing expense
 *     description: Updates an expense belonging to the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB expense ID
 *         example: 6a7eb5c4af4f9b17897e0ac5
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               title:
 *                 type: string
 *                 description: Expense title
 *                 example: Lunch Updated
 *
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Expense amount
 *                 example: 300
 *
 *               category:
 *                 type: string
 *                 description: Expense category
 *                 example: Food
 *
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method
 *                 example: UPI
 *
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Expense date
 *                 example: 2026-08-14
 *
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *                 example: Office lunch - updated
 *
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *
 *       400:
 *         description: Validation failed or invalid expense data
 *
 *       401:
 *         description: Invalid or expired JWT token
 *
 *       404:
 *         description: Expense not found
 *
 *       500:
 *         description: Failed to update expense
 */
router.put(
  "/:id",
  validateUpdateExpense,
  updateExpenseData
);


/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     description: Deletes an expense belonging to the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB expense ID
 *         example: 6a7eb5c4af4f9b17897e0ac5
 *
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *
 *       401:
 *         description: Invalid or expired JWT token
 *
 *       404:
 *         description: Expense not found
 *
 *       500:
 *         description: Failed to delete expense
 */
router.delete(
  "/:id",
  deleteExpenseData
);


module.exports = router;