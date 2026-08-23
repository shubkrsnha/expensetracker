const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,

  getAnalyticsSummary,
  getCategoryAnalytics,
  getMonthlyAnalytics,

  registerUser,
  loginUser,
  getUserProfile,
} = require("../services/gatewayService");


// ==========================================
// AUTHENTICATION
// ==========================================

// ==========================================
// REGISTER USER
// ==========================================

const registerUserData = async (req, res) => {
  try {
    const data = await registerUser(req.body);

    return res.status(201).json(data);

  } catch (error) {
    console.log(
      "Register User error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message: "Failed to register user",
        error: error.message,
      }
    );
  }
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUserData = async (req, res) => {
  try {
    const data = await loginUser(req.body);

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Login User error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message: "Failed to login user",
        error: error.message,
      }
    );
  }
};


// ==========================================
// GET USER PROFILE
// ==========================================

const getUserProfileData = async (req, res) => {
  try {
    console.log("\n========== PROFILE DEBUG ==========");

    console.log(
      "User from JWT:",
      req.user
    );

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const [scheme, token] =
      authHeader.split(" ");

    console.log("Scheme:", scheme);
    console.log(
      "Token exists:",
      !!token
    );

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        message:
          "Authorization header must be: Bearer <token>",
      });
    }

    console.log(
      "Calling Auth Service..."
    );

    const data =
      await getUserProfile(token);

    console.log(
      "Auth Service profile successful"
    );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "\n========== PROFILE ERROR =========="
    );

    console.log(
      "Error:",
      error.message
    );

    console.log(
      "Status:",
      error.response?.status
    );

    console.log(
      "Response:",
      error.response?.data
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to fetch user profile",
        error: error.message,
      }
    );
  }
};


// ==========================================
// EXPENSES
// ==========================================

// ==========================================
// GET ALL EXPENSES
// ==========================================

const fetchExpenses = async (req, res) => {
  try {
    const data = await getExpenses(
      req.query,
      req.user.userId
    );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Expense Service error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to fetch expenses",
        error: error.message,
      }
    );
  }
};


// ==========================================
// GET EXPENSE BY ID
// ==========================================

const fetchExpenseById = async (
  req,
  res
) => {
  try {
    const data =
      await getExpenseById(
        req.params.id,
        req.user.userId
      );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Get Expense By ID error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to fetch expense",
        error: error.message,
      }
    );
  }
};


// ==========================================
// CREATE EXPENSE
// ==========================================

const createExpenseData = async (
  req,
  res
) => {
  try {
    const data =
      await createExpense(
        req.body,
        req.user.userId
      );

    return res.status(201).json(data);

  } catch (error) {
    console.log(
      "Create Expense error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to create expense",
        error: error.message,
      }
    );
  }
};


// ==========================================
// UPDATE EXPENSE
// ==========================================

const updateExpenseData = async (
  req,
  res
) => {
  try {
    const data =
      await updateExpense(
        req.params.id,
        req.body,
        req.user.userId
      );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Update Expense error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to update expense",
        error: error.message,
      }
    );
  }
};


// ==========================================
// DELETE EXPENSE
// ==========================================

const deleteExpenseData = async (
  req,
  res
) => {
  try {
    const data =
      await deleteExpense(
        req.params.id,
        req.user.userId
      );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Delete Expense error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to delete expense",
        error: error.message,
      }
    );
  }
};


// ==========================================
// ANALYTICS SUMMARY
// ==========================================

const fetchAnalyticsSummary = async (
  req,
  res
) => {
  try {
    const data =
      await getAnalyticsSummary(
        req.user.userId
      );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Analytics Service error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to fetch analytics",
        error: error.message,
      }
    );
  }
};


// ==========================================
// CATEGORY ANALYTICS
// ==========================================

const fetchCategoryAnalytics = async (
  req,
  res
) => {
  try {
    const data =
      await getCategoryAnalytics(
        req.user.userId
      );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Category Analytics error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to fetch category analytics",
        error: error.message,
      }
    );
  }
};


// ==========================================
// MONTHLY ANALYTICS
// ==========================================

const fetchMonthlyAnalytics = async (
  req,
  res
) => {
  try {
    const data =
      await getMonthlyAnalytics(
        req.user.userId
      );

    return res.status(200).json(data);

  } catch (error) {
    console.log(
      "Monthly Analytics error:",
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        message:
          "Failed to fetch monthly analytics",
        error: error.message,
      }
    );
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  // Authentication
  registerUserData,
  loginUserData,
  getUserProfileData,

  // Expenses
  fetchExpenses,
  fetchExpenseById,
  createExpenseData,
  updateExpenseData,
  deleteExpenseData,

  // Analytics
  fetchAnalyticsSummary,
  fetchCategoryAnalytics,
  fetchMonthlyAnalytics,
};