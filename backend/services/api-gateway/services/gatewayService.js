const axios = require("axios");

// ==========================================
// SERVICE URLS
// ==========================================

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ||
  "http://localhost:5004";

const EXPENSE_SERVICE_URL =
  process.env.EXPENSE_SERVICE_URL ||
  "http://localhost:5001";

const ANALYTICS_SERVICE_URL =
  process.env.ANALYTICS_SERVICE_URL ||
  "http://localhost:5002";


// ==========================================
// INTERNAL HEADERS
// ==========================================

const getInternalHeaders = (userId) => {
  return {
    "X-Internal-API-Key": process.env.INTERNAL_API_KEY,
    "X-User-Id": userId,
  };
};


// ==========================================
// AUTHENTICATION
// ==========================================

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_SERVICE_URL}/api/auth/register`,
    userData
  );

  return response.data;
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_SERVICE_URL}/api/auth/login`,
    userData
  );

  return response.data;
};


// ==========================================
// GET USER PROFILE
// ==========================================

const getUserProfile = async (token) => {
  const response = await axios.get(
    `${AUTH_SERVICE_URL}/api/auth/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==========================================
// EXPENSES
// ==========================================

// ==========================================
// GET ALL EXPENSES
// ==========================================

const getExpenses = async (queryParams, userId) => {
  const response = await axios.get(
    `${EXPENSE_SERVICE_URL}/api/expenses`,
    {
      params: queryParams,
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// GET EXPENSE BY ID
// ==========================================

const getExpenseById = async (expenseId, userId) => {
  const response = await axios.get(
    `${EXPENSE_SERVICE_URL}/api/expenses/${expenseId}`,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// CREATE EXPENSE
// ==========================================

const createExpense = async (expenseData, userId) => {
  const response = await axios.post(
    `${EXPENSE_SERVICE_URL}/api/expenses`,
    expenseData,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// UPDATE EXPENSE
// ==========================================

const updateExpense = async (
  expenseId,
  expenseData,
  userId
) => {
  const response = await axios.put(
    `${EXPENSE_SERVICE_URL}/api/expenses/${expenseId}`,
    expenseData,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// DELETE EXPENSE
// ==========================================

const deleteExpense = async (
  expenseId,
  userId
) => {
  const response = await axios.delete(
    `${EXPENSE_SERVICE_URL}/api/expenses/${expenseId}`,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// ANALYTICS
// ==========================================

// ==========================================
// ANALYTICS SUMMARY
// ==========================================

const getAnalyticsSummary = async (userId) => {
  const response = await axios.get(
    `${ANALYTICS_SERVICE_URL}/api/analytics/summary`,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// CATEGORY ANALYTICS
// ==========================================

const getCategoryAnalytics = async (userId) => {
  const response = await axios.get(
    `${ANALYTICS_SERVICE_URL}/api/analytics/category`,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// MONTHLY ANALYTICS
// ==========================================

const getMonthlyAnalytics = async (userId) => {
  const response = await axios.get(
    `${ANALYTICS_SERVICE_URL}/api/analytics/monthly`,
    {
      headers: getInternalHeaders(userId),
    }
  );

  return response.data;
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // Authentication
  registerUser,
  loginUser,
  getUserProfile,

  // Expenses
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,

  // Analytics
  getAnalyticsSummary,
  getCategoryAnalytics,
  getMonthlyAnalytics,
};