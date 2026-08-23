const express = require("express");

const authRoutes = require("./routes/authRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "auth-service",
    status: "UP",
  });
});

// ==========================================
// SWAGGER
// ==========================================

app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

module.exports = app;