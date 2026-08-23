const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    console.log("\n========== AUTH DEBUG ==========");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);
    console.log("JWT SECRET LENGTH:", process.env.JWT_SECRET?.length);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is missing",
      });
    }

    // Expected:
    // Authorization: Bearer <token>

    const [scheme, token] = authHeader.split(" ");

    console.log("SCHEME:", scheme);
    console.log("TOKEN EXISTS:", !!token);
    console.log("TOKEN LENGTH:", token?.length);

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Authorization header must be: Bearer <token>",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("JWT VERIFIED");
    console.log("USER:", decoded);

    req.user = decoded;

    next();

  } catch (error) {
    console.log("\n========== JWT ERROR ==========");
    console.log("ERROR NAME:", error.name);
    console.log("ERROR MESSAGE:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}

module.exports = authMiddleware;