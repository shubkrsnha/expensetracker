const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(express.json());

app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Analytics Service running on port ${PORT}`);
});