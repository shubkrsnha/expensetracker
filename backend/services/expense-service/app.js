const express = require("express");

const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();


// ==========================================
// SECURITY / REQUEST CONFIGURATION
// ==========================================

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "100kb",
  })
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "expense-service",
    status: "UP",
  });
});


// ==========================================
// EXPENSE ROUTES
// ==========================================

app.use("/api/expenses", expenseRoutes);


// ==========================================
// CENTRAL ERROR HANDLER
// IMPORTANT: MUST BE LAST
// ==========================================

app.use(errorHandler);

module.exports = app;