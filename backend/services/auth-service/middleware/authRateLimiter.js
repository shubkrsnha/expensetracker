const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Allow only 5 login attempts per IP
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    console.log("🚨 LOGIN RATE LIMIT HIT");
    console.log("IP:", req.ip);

    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  },
});

module.exports = loginLimiter;