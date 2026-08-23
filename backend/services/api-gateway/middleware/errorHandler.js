
function errorHandler(err, req, res, next) {
  console.error("========== CENTRAL ERROR HANDLER ==========");
  console.error("Request ID:", req.requestId);
  console.error("METHOD:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("ERROR NAME:", err.name);
  console.error("ERROR MESSAGE:", err.message);
  console.error("============================================");

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid expense ID",
      requestId: req.requestId,
    });
  }

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