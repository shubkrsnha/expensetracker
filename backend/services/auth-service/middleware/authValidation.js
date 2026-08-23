const Joi = require("joi");


// ==========================================
// REGISTER VALIDATION
// ==========================================

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(100)
    .required(),
});


// ==========================================
// LOGIN VALIDATION
// ==========================================

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(100)
    .required(),
});


// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};


const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};


module.exports = {
  validateRegister,
  validateLogin,
};