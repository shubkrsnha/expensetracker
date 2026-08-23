const express = require("express");

const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const internalAuth = require("../middleware/internalAuth");

const {
  validateCreateExpense,
  validateUpdateExpense,
} = require("../middleware/expenseValidation");

// ==========================================
// INTERNAL AUTHENTICATION
// ==========================================

router.use(internalAuth);

// ==========================================
// CREATE EXPENSE
// ==========================================

router.post(
  "/",
  validateCreateExpense,
  createExpense
);

// ==========================================
// GET ALL EXPENSES
// ==========================================

router.get(
  "/",
  getExpenses
);

// ==========================================
// GET EXPENSE BY ID
// ==========================================

router.get(
  "/:id",
  getExpenseById
);

// ==========================================
// UPDATE EXPENSE
// ==========================================

router.put(
  "/:id",
  validateUpdateExpense,
  updateExpense
);

// ==========================================
// DELETE EXPENSE
// ==========================================

router.delete(
  "/:id",
  deleteExpense
);

module.exports = router;
