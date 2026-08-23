const express = require("express");

const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());


// ==========================================
// SECURITY
// ==========================================

app.use(helmet());

app.use(cors());


// ==========================================
// LOGGING
// ==========================================

app.use(morgan("combined"));


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.json({
    service: "analytics-service",
    status: "UP",
    environment: process.env.NODE_ENV || "development",
  });
});


// ==========================================
// ANALYTICS ROUTES
// ==========================================

app.use(
  "/api/analytics",
  analyticsRoutes
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Analytics Service Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


module.exports = app;