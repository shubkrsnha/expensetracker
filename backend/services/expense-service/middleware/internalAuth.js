const internalAuth = (req, res, next) => {
  const apiKey = req.headers["x-internal-api-key"];
  const expectedApiKey = process.env.INTERNAL_API_KEY;

  if (!expectedApiKey) {
    console.error("INTERNAL_API_KEY is not configured");

    return res.status(500).json({
      message: "Internal authentication is not configured",
    });
  }

  if (!apiKey) {
    return res.status(401).json({
      message: "Internal API key is missing",
    });
  }

  if (apiKey !== expectedApiKey) {
    return res.status(403).json({
      message: "Invalid internal API key",
    });
  }

  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      message: "User identity is missing",
    });
  }

  req.userId = userId;

  next();
};

module.exports = internalAuth;