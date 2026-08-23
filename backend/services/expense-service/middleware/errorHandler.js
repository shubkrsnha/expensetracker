function errorHandler(err, req, res, next) {
  console.error(
    "========== CENTRAL ERROR HANDLER =========="
  );

  console.error("Request ID:", req.requestId);
  console.error("METHOD:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("ERROR NAME:", err.name);
  console.error("ERROR MESSAGE:", err.message);

  console.error(
    "============================================"
  );

  // ==========================================
  // INVALID MONGODB OBJECT ID
  // ==========================================

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid expense ID",
      requestId: req.requestId,
    });
  }

  // ==========================================
  // MONGOOSE VALIDATION ERROR
  // ==========================================

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors: Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      })),
      requestId: req.requestId,
    });
  }

  // ==========================================
  // DUPLICATE KEY ERROR
  // ==========================================

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate resource",
      requestId: req.requestId,
    });
  }

  // ==========================================
  // CUSTOM STATUS ERROR
  // ==========================================

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,

    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,

    requestId: req.requestId,
  });
}

module.exports = errorHandler;