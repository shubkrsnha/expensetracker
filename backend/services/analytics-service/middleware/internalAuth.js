const internalAuth = (req, res, next) => {
  const apiKey = req.headers["x-internal-api-key"];
  const userId = req.headers["x-user-id"];

  if (!apiKey) {
    return res.status(401).json({
      message: "Internal API key is missing",
    });
  }

  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({
      message: "Invalid internal API key",
    });
  }

  if (!userId) {
    return res.status(401).json({
      message: "User identity is missing",
    });
  }

  req.userId = userId;

  console.log("Authenticated internal user:", req.userId);

  next();
};

module.exports = internalAuth;