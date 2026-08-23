const Joi = require("joi");

// ==========================================
// ALLOWED VALUES
// ==========================================

const allowedCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
  "Education",
  "Other",
];

const allowedPaymentMethods = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Other",
];

// ==========================================
// CREATE EXPENSE SCHEMA
// ==========================================

const createExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  amount: Joi.number()
    .positive()
    .precision(2)
    .required(),

  category: Joi.string()
    .trim()
    .valid(...allowedCategories)
    .required(),

  paymentMethod: Joi.string()
    .trim()
    .valid(...allowedPaymentMethods)
    .required(),

  date: Joi.date()
    .iso()
    .required(),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .optional(),
})
  .unknown(false);

// ==========================================
// UPDATE EXPENSE SCHEMA
// ==========================================

const updateExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100),

  amount: Joi.number()
    .positive()
    .precision(2),

  category: Joi.string()
    .trim()
    .valid(...allowedCategories),

  paymentMethod: Joi.string()
    .trim()
    .valid(...allowedPaymentMethods),

  date: Joi.date()
    .iso(),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow(""),
})
  .min(1)
  .unknown(false);

// ==========================================
// CREATE VALIDATION
// ==========================================

const validateCreateExpense = (req, res, next) => {
  const { error, value } = createExpenseSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: false,
    }
  );

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.body = value;

  next();
};

// ==========================================
// UPDATE VALIDATION
// ==========================================

const validateUpdateExpense = (req, res, next) => {
  const { error, value } = updateExpenseSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: false,
    }
  );

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.body = value;

  next();
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  validateCreateExpense,
  validateUpdateExpense,
};
