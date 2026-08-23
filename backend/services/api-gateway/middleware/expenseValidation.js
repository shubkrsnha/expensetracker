const Joi = require("joi");

const createExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  category: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  paymentMethod: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  date: Joi.date()
    .required(),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .optional(),
});


const updateExpenseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100),

  amount: Joi.number()
    .positive(),

  category: Joi.string()
    .trim()
    .min(2)
    .max(50),

  paymentMethod: Joi.string()
    .trim()
    .min(2)
    .max(50),

  date: Joi.date(),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow(""),
}).min(1);


const validateCreateExpense = (req, res, next) => {
  const { error, value } =
    createExpenseSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

  if (error) {
    return res.status(400).json({
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


const validateUpdateExpense = (req, res, next) => {
  const { error, value } =
    updateExpenseSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

  if (error) {
    return res.status(400).json({
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


module.exports = {
  validateCreateExpense,
  validateUpdateExpense,
};