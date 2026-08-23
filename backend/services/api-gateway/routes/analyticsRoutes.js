const express = require("express");

const {
  fetchAnalyticsSummary,
  fetchCategoryAnalytics,
  fetchMonthlyAnalytics,
} = require("../controllers/gatewayController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Expense analytics and reporting APIs
 */

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get expense summary
 *     description: Returns overall spending statistics for the authenticated user.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 *       401:
 *         description: Invalid or expired JWT token
 *       500:
 *         description: Failed to fetch analytics
 */
router.get(
  "/summary",
  fetchAnalyticsSummary
);


/**
 * @swagger
 * /api/analytics/category:
 *   get:
 *     summary: Get category-wise analytics
 *     description: Returns spending grouped by expense category.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category analytics fetched successfully
 *       401:
 *         description: Invalid or expired JWT token
 *       500:
 *         description: Failed to fetch category analytics
 */
router.get(
  "/category",
  fetchCategoryAnalytics
);


/**
 * @swagger
 * /api/analytics/monthly:
 *   get:
 *     summary: Get monthly analytics
 *     description: Returns monthly spending and transaction counts.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly analytics fetched successfully
 *       401:
 *         description: Invalid or expired JWT token
 *       500:
 *         description: Failed to fetch monthly analytics
 */
router.get(
  "/monthly",
  fetchMonthlyAnalytics
);


module.exports = router;