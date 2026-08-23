const express = require("express");

const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const requestId = require("./middleware/requestId");

const expenseRoutes = require("./routes/expenseRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const apiLimiter = require("./middleware/rateLimiter");

const errorHandler = require("./middleware/errorHandler");

const app = express();


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());


// ==========================================
// SECURITY
// ==========================================

app.use(helmet());


// ==========================================
// CORS
// ==========================================

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS
      .split(",")
      .map((origin) => origin.trim())
  : [];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS rejected origin:", origin);
      console.error("Allowed origins:", allowedOrigins);

      return callback(
        new Error("CORS policy: Origin not allowed")
      );
    },

    credentials: true,
  })
);


// ==========================================
// REQUEST ID
// ==========================================

app.use(requestId);


// ==========================================
// LOGGING
// ==========================================

app.use(
  morgan(
    ":method :url :status :response-time ms requestId=:req[x-request-id]"
  )
);


// ==========================================
// SWAGGER
// ==========================================

// Swagger JSON
app.get(
  "/api-docs/swagger.json",
  (req, res) => {
    res.json(swaggerSpec);
  }
);


// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
  "/health",
  (req, res) => {

    res.status(200).json({
      service: "api-gateway",
      status: "UP",
    });

  }
);


// ==========================================
// API RATE LIMITING
// ==========================================

// IMPORTANT:
// Rate limiter must be before protected API routes.

app.use(
  "/api",
  apiLimiter
);


// ==========================================
// AUTH ROUTES
// ==========================================

// Public routes
//
// POST /api/auth/register
// POST /api/auth/login
//
// These routes DO NOT require JWT.

app.use(
  "/api/auth",
  authRoutes
);


// ==========================================
// EXPENSE ROUTES
// ==========================================

// JWT protected
//
// GET    /api/expenses
// POST   /api/expenses
// GET    /api/expenses/:id
// PUT    /api/expenses/:id
// DELETE /api/expenses/:id

app.use(
  "/api/expenses",
  authMiddleware,
  expenseRoutes
);


// ==========================================
// ANALYTICS ROUTES
// ==========================================

// JWT protected
//
// GET /api/analytics/summary
// GET /api/analytics/category
// GET /api/analytics/monthly

app.use(
  "/api/analytics",
  authMiddleware,
  analyticsRoutes
);


// ==========================================
// 404 ROUTE HANDLER
// ==========================================

// If no route matched the request,
// create a 404 error.

app.use(
  (req, res, next) => {

    const error = new Error(
      `Route not found: ${req.method} ${req.originalUrl}`
    );

    error.statusCode = 404;

    next(error);
  }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);


// ==========================================
// EXPORT APP
// ==========================================

module.exports = app;