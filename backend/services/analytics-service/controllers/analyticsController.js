const {
  getAnalytics,
  getCategoryAnalytics,
  getMonthlyAnalytics,
} = require("../services/analyticsService");

// ==========================================
// ANALYTICS SUMMARY
// ==========================================

const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const analytics = await getAnalytics(userId);

    res.status(200).json({
      message: "Analytics fetched successfully",
      analytics,
    });

  } catch (error) {
    console.error("Analytics summary error:", error.message);

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message: "Failed to fetch analytics",
        error: error.message,
      }
    );
  }
};

// ==========================================
// CATEGORY ANALYTICS
// ==========================================

const getCategoryAnalyticsData = async (req, res) => {
  try {
    const userId = req.userId;

    const analytics =
      await getCategoryAnalytics(userId);

    res.status(200).json({
      message: "Category analytics fetched successfully",
      analytics,
    });

  } catch (error) {
    console.error("Category analytics error:", error.message);

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message: "Failed to fetch category analytics",
        error: error.message,
      }
    );
  }
};

// ==========================================
// MONTHLY ANALYTICS
// ==========================================

const getMonthlyAnalyticsData = async (req, res) => {
  try {
    const userId = req.userId;

    const analytics =
      await getMonthlyAnalytics(userId);

    res.status(200).json({
      message: "Monthly analytics fetched successfully",
      analytics,
    });

  } catch (error) {
    console.error("Monthly analytics error:", error.message);

    res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message: "Failed to fetch monthly analytics",
        error: error.message,
      }
    );
  }
};

module.exports = {
  getAnalyticsSummary,
  getCategoryAnalyticsData,
  getMonthlyAnalyticsData,
};