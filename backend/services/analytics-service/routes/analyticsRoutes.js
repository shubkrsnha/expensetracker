const express = require("express");

const router = express.Router();

const internalAuth =
  require("../middleware/internalAuth");

const {
  getAnalyticsSummary,
  getCategoryAnalyticsData,
  getMonthlyAnalyticsData,
} = require("../controllers/analyticsController");


// ==========================================
// INTERNAL AUTHENTICATION
// ==========================================

router.use(internalAuth);


// ==========================================
// ANALYTICS SUMMARY
// ==========================================

router.get(
  "/summary",
  getAnalyticsSummary
);


// ==========================================
// CATEGORY ANALYTICS
// ==========================================

router.get(
  "/category",
  getCategoryAnalyticsData
);


// ==========================================
// MONTHLY ANALYTICS
// ==========================================

router.get(
  "/monthly",
  getMonthlyAnalyticsData
);


module.exports = router;