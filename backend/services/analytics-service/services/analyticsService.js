require("dotenv").config();

const axios = require("axios");

const EXPENSE_SERVICE_URL =
  process.env.EXPENSE_SERVICE_URL ||
  "http://localhost:5001";


// ==========================================
// GET USER EXPENSES FROM EXPENSE SERVICE
// ==========================================

const getExpensesForAnalytics = async (userId) => {
  try {
    const response = await axios.get(
      `${EXPENSE_SERVICE_URL}/api/expenses`,
      {
        params: {
          limit: 100,
        },

        headers: {
          "X-Internal-API-Key":
            process.env.INTERNAL_API_KEY,

          "X-User-Id": userId,
        },
      }
    );

    return response.data.expenses || [];

  } catch (error) {

    console.log(
      "Expense Service communication failed:",
      error.message
    );

    throw error;
  }
};


// ==========================================
// ANALYTICS SUMMARY
// ==========================================

const getAnalytics = async (userId) => {

  const expenses =
    await getExpensesForAnalytics(userId);


  // ==========================================
  // TOTAL SPENDING
  // ==========================================

  let totalSpending = 0;

  for (let i = 0; i < expenses.length; i++) {

    totalSpending =
      totalSpending +
      expenses[i].amount;
  }


  // ==========================================
  // HIGHEST AND LOWEST EXPENSE
  // ==========================================

  let highestExpense = 0;
  let lowestExpense = 0;

  if (expenses.length > 0) {

    highestExpense =
      expenses[0].amount;

    lowestExpense =
      expenses[0].amount;


    for (let i = 1; i < expenses.length; i++) {

      if (
        expenses[i].amount >
        highestExpense
      ) {
        highestExpense =
          expenses[i].amount;
      }


      if (
        expenses[i].amount <
        lowestExpense
      ) {
        lowestExpense =
          expenses[i].amount;
      }
    }
  }


  // ==========================================
  // TOTAL TRANSACTIONS
  // ==========================================

  const totalTransactions =
    expenses.length;


  // ==========================================
  // AVERAGE EXPENSE
  // ==========================================

  let averageExpense = 0;

  if (totalTransactions > 0) {

    averageExpense =
      totalSpending /
      totalTransactions;
  }


  // ==========================================
  // CATEGORY TOTALS
  // ==========================================

  const categoryTotals = {};


  for (let i = 0; i < expenses.length; i++) {

    const category =
      expenses[i].category;

    const amount =
      expenses[i].amount;


    if (!categoryTotals[category]) {

      categoryTotals[category] = {
        amount: 0,
        transactions: 0,
      };
    }


    categoryTotals[category].amount =
      categoryTotals[category].amount +
      amount;


    categoryTotals[category].transactions =
      categoryTotals[category].transactions +
      1;
  }


  // ==========================================
  // RETURN SUMMARY
  // ==========================================

  return {
    totalSpending,
    totalTransactions,
    averageExpense,
    highestExpense,
    lowestExpense,
    categoryTotals,
  };
};


// ==========================================
// CATEGORY ANALYTICS
// ==========================================

const getCategoryAnalytics = async (userId) => {

  const expenses =
    await getExpensesForAnalytics(userId);


  // ==========================================
  // TOTAL SPENDING
  // ==========================================

  let totalSpending = 0;


  for (let i = 0; i < expenses.length; i++) {

    totalSpending =
      totalSpending +
      expenses[i].amount;
  }


  // ==========================================
  // GROUP BY CATEGORY
  // ==========================================

  const categoryTotals = {};


  for (let i = 0; i < expenses.length; i++) {

    const category =
      expenses[i].category;

    const amount =
      expenses[i].amount;


    if (!categoryTotals[category]) {

      categoryTotals[category] = {
        category: category,
        amount: 0,
        transactions: 0,
        percentage: 0,
      };
    }


    categoryTotals[category].amount =
      categoryTotals[category].amount +
      amount;


    categoryTotals[category].transactions =
      categoryTotals[category].transactions +
      1;
  }


  // ==========================================
  // CALCULATE PERCENTAGE
  // ==========================================

  const categories = [];


  for (const category in categoryTotals) {

    const categoryData =
      categoryTotals[category];

    let percentage = 0;


    if (totalSpending > 0) {

      percentage =
        (categoryData.amount /
          totalSpending) *
        100;
    }


    categories.push({

      category:
        categoryData.category,

      amount:
        categoryData.amount,

      transactions:
        categoryData.transactions,

      percentage:
        Number(
          percentage.toFixed(2)
        ),
    });
  }


  // ==========================================
  // RETURN CATEGORY ANALYTICS
  // ==========================================

  return {
    totalSpending,
    categories,
  };
};


// ==========================================
// MONTHLY ANALYTICS
// ==========================================

const getMonthlyAnalytics = async (userId) => {

  const expenses =
    await getExpensesForAnalytics(userId);


  const monthlyTotals = {};


  // ==========================================
  // GROUP EXPENSES BY MONTH
  // ==========================================

  for (let i = 0; i < expenses.length; i++) {

    const expense =
      expenses[i];


    const date =
      new Date(expense.date);


    const year =
      date.getFullYear();


    const month =
      date.getMonth() + 1;


    const monthKey =
      `${year}-${String(month).padStart(2, "0")}`;


    if (!monthlyTotals[monthKey]) {

      monthlyTotals[monthKey] = {

        month:
          monthKey,

        amount:
          0,

        transactions:
          0,
      };
    }


    monthlyTotals[monthKey].amount =
      monthlyTotals[monthKey].amount +
      expense.amount;


    monthlyTotals[monthKey].transactions =
      monthlyTotals[monthKey].transactions +
      1;
  }


  // ==========================================
  // CONVERT OBJECT TO ARRAY
  // ==========================================

  const monthlyData = [];


  for (const month in monthlyTotals) {

    monthlyData.push(
      monthlyTotals[month]
    );
  }


  // ==========================================
  // SORT BY MONTH
  // ==========================================

  monthlyData.sort((a, b) => {

    return a.month.localeCompare(
      b.month
    );
  });


  // ==========================================
  // RETURN MONTHLY ANALYTICS
  // ==========================================

  return {
    monthly:
      monthlyData,
  };
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getAnalytics,
  getCategoryAnalytics,
  getMonthlyAnalytics,
};