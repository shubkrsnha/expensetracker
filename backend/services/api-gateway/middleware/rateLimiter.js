const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,

  max: Number(process.env.RATE_LIMIT_MAX) || 100,

  standardHeaders: true,

  legacyHeaders: false,

  handler: (req, res) => {
    console.log("🚨 RATE LIMIT HIT");
    console.log("IP:", req.ip);

    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
      requestId: req.id,
    });
  },
});

module.exports = apiLimiter;