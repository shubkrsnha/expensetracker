import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./Dashboard.css";

const API_URL = "";

const DEFAULT_COLOR = "#78909C";

const CATEGORY_COLORS = {
  Food: "#4CAF50",
  Shopping: "#FF9800",
  Transport: "#2196F3",
  Entertainment: "#9C27B0",
  Utilities: "#F44336",
  Other: DEFAULT_COLOR,
};

const CATEGORY_ICONS = {
  Food: "🍔",
  Shopping: "🛍️",
  Transport: "🚗",
  Entertainment: "🎬",
  Utilities: "💡",
  Other: "💳",
};

const EMPTY_SUMMARY = {
  totalSpending: 0,
  totalTransactions: 0,
  averageExpense: 0,
  highestExpense: 0,
};


/* ==========================================
   HELPER FUNCTIONS
========================================== */

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};


const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const getCategoryIcon = (category) => {
  return (
    CATEGORY_ICONS[category] ||
    CATEGORY_ICONS.Other
  );
};


const getCategoryColor = (category) => {
  return (
    CATEGORY_COLORS[category] ||
    DEFAULT_COLOR
  );
};


const getErrorMessage = (
  error,
  fallbackMessage
) => {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallbackMessage;
};


const getUserName = () => {
  try {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return "there";
    }

    const user = JSON.parse(storedUser);

    return (
      user?.name ||
      user?.username ||
      "there"
    );
  } catch {
    return "there";
  }
};


/*
 * Add the chart color directly to each
 * data item.
 *
 * This removes the deprecated Recharts
 * <Cell /> component.
 */
const prepareChartData = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    ...item,
    fill: getCategoryColor(
      item.category
    ),
  }));
};


/*
 * Find the category with the highest
 * spending amount.
 *
 * Initial value is provided to satisfy
 * SonarQube S6959.
 */
const getTopCategory = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      amount: 0,
      category: "",
    };
  }

  return data.reduce(
    (highest, category) => {
      const highestAmount = Number(
        highest.amount || 0
      );

      const categoryAmount = Number(
        category.amount || 0
      );

      if (categoryAmount > highestAmount) {
        return category;
      }

      return highest;
    },
    {
      amount: 0,
      category: "",
    }
  );
};


/* ==========================================
   COMPONENT
========================================== */

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [summary, setSummary] =
    useState(EMPTY_SUMMARY);

  const [categoryData, setCategoryData] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ==========================================
     LOAD DASHBOARD
  ========================================== */

  const loadDashboard = useCallback(
    async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          summaryResponse,
          categoryResponse,
          expenseResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/analytics/summary`,
            {
              method: "GET",
              headers,
            }
          ),

          fetch(
            `${API_URL}/api/analytics/category`,
            {
              method: "GET",
              headers,
            }
          ),

          fetch(
            `${API_URL}/api/expenses`,
            {
              method: "GET",
              headers,
            }
          ),
        ]);


        /*
         * Read API responses safely.
         */
        let summaryResult = {};
        let categoryResult = {};
        let expenseResult = {};

        try {
          summaryResult =
            await summaryResponse.json();
        } catch {
          summaryResult = {};
        }

        try {
          categoryResult =
            await categoryResponse.json();
        } catch {
          categoryResult = {};
        }

        try {
          expenseResult =
            await expenseResponse.json();
        } catch {
          expenseResult = {};
        }


        /*
         * Validate all API responses.
         */
        if (!summaryResponse.ok) {
          throw new Error(
            summaryResult.message ||
              "Unable to load spending summary"
          );
        }

        if (!categoryResponse.ok) {
          throw new Error(
            categoryResult.message ||
              "Unable to load category data"
          );
        }

        if (!expenseResponse.ok) {
          throw new Error(
            expenseResult.message ||
              "Unable to load expenses"
          );
        }


        /* ======================================
           SUMMARY
        ====================================== */

        const analytics =
          summaryResult.analytics;

        if (
          analytics &&
          typeof analytics === "object"
        ) {
          setSummary({
            totalSpending:
              Number(
                analytics.totalSpending
              ) || 0,

            totalTransactions:
              Number(
                analytics.totalTransactions
              ) || 0,

            averageExpense:
              Number(
                analytics.averageExpense
              ) || 0,

            highestExpense:
              Number(
                analytics.highestExpense
              ) || 0,
          });
        } else {
          setSummary(EMPTY_SUMMARY);
        }


        /* ======================================
           CATEGORY DATA
        ====================================== */

        const categories =
          categoryResult.analytics
            ?.categories ||
          categoryResult.categories ||
          [];

        if (Array.isArray(categories)) {
          setCategoryData(categories);
        } else {
          setCategoryData([]);
        }


        /* ======================================
           RECENT EXPENSES
        ====================================== */

        const expenseList =
          expenseResult.expenses ||
          expenseResult.data ||
          [];

        if (Array.isArray(expenseList)) {
          setExpenses(
            expenseList.slice(0, 5)
          );
        } else {
          setExpenses([]);
        }
      } catch (dashboardError) {
        console.error(
          "Dashboard error:",
          dashboardError
        );

        setError(
          getErrorMessage(
            dashboardError,
            "Unable to load dashboard"
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, token]
  );


  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);


  /* ==========================================
     CHART DATA
  ========================================== */

  const chartData =
    prepareChartData(categoryData);


  /* ==========================================
     TOP CATEGORY
  ========================================== */

  const topCategory =
    getTopCategory(categoryData);


  /* ==========================================
     USER NAME
  ========================================== */

  const userName = getUserName();


  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <main
        className="dashboard-loading"
        aria-live="polite"
      >
        <div
          className="dashboard-spinner"
          aria-hidden="true"
        />

        <p>
          Loading your dashboard...
        </p>
      </main>
    );
  }


  /* ==========================================
     RENDER
  ========================================== */

  return (
    <main className="dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="dashboard-header">

        <div className="dashboard-heading">

          <span className="dashboard-eyebrow">
            EXPENSEFLOW
          </span>

          <h1>
            Welcome back, {userName} 👋
          </h1>

          <p>
            Here's what's happening with
            your spending.
          </p>

        </div>


        <button
          type="button"
          className="dashboard-add-button"
          onClick={() =>
            navigate("/expenses")
          }
        >
          <span aria-hidden="true">
            +
          </span>

          <span>
            Add Expense
          </span>
        </button>

      </section>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="dashboard-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* ======================================
          STAT CARDS
      ====================================== */}

      <section
        className="dashboard-stats"
        aria-label="Expense statistics"
      >

        {/* TOTAL SPENDING */}

        <article
          className="stat-card stat-primary"
        >

          <div className="stat-top">

            <span>
              TOTAL SPENDING
            </span>

            <div
              className="stat-icon"
              aria-hidden="true"
            >
              ₹
            </div>

          </div>

          <strong>
            {formatMoney(
              summary.totalSpending
            )}
          </strong>

          <small>
            This month
          </small>

        </article>


        {/* TRANSACTIONS */}

        <article className="stat-card">

          <div className="stat-top">

            <span>
              TRANSACTIONS
            </span>

            <div
              className="stat-icon light"
              aria-hidden="true"
            >
              #
            </div>

          </div>

          <strong>
            {summary.totalTransactions}
          </strong>

          <small>
            Total transactions
          </small>

        </article>


        {/* AVERAGE */}

        <article className="stat-card">

          <div className="stat-top">

            <span>
              AVERAGE EXPENSE
            </span>

            <div
              className="stat-icon light"
              aria-hidden="true"
            >
              ↗
            </div>

          </div>

          <strong>
            {formatMoney(
              summary.averageExpense
            )}
          </strong>

          <small>
            Per transaction
          </small>

        </article>


        {/* HIGHEST */}

        <article className="stat-card">

          <div className="stat-top">

            <span>
              HIGHEST EXPENSE
            </span>

            <div
              className="stat-icon light"
              aria-hidden="true"
            >
              ↑
            </div>

          </div>

          <strong>
            {formatMoney(
              summary.highestExpense
            )}
          </strong>

          <small>
            Highest transaction
          </small>

        </article>

      </section>


      {/* ======================================
          MAIN GRID
      ====================================== */}

      <section className="dashboard-grid">

        {/* ====================================
            CATEGORY CHART
        ==================================== */}

        <article className="dashboard-card">

          <div className="card-header">

            <div>

              <span>
                SPENDING
              </span>

              <h2>
                By Category
              </h2>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/categories")
              }
            >
              View details →
            </button>

          </div>


          {chartData.length === 0 ? (

            <div className="dashboard-empty">

              <div
                aria-hidden="true"
              >
                📊
              </div>

              <h3>
                No spending data
              </h3>

              <p>
                Add expenses to see your
                category breakdown.
              </p>

            </div>

          ) : (

            <div className="dashboard-chart">

              {/* DONUT CHART */}

              <div className="donut-chart">

                <ResponsiveContainer
                  width="100%"
                  height={280}
                >

                  <PieChart>

                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={105}
                      paddingAngle={3}
                      stroke="none"
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatMoney(value)
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>


                <div className="donut-center">

                  <span>
                    TOTAL
                  </span>

                  <strong>
                    {formatMoney(
                      summary.totalSpending
                    )}
                  </strong>

                </div>

              </div>


              {/* CATEGORY LEGEND */}

              <div className="category-legend">

                {categoryData.map(
                  (item) => (
                    <div
                      className="legend-row"
                      key={item.category}
                    >

                      <div>

                        <span
                          className="legend-dot"
                          aria-hidden="true"
                          style={{
                            backgroundColor:
                              getCategoryColor(
                                item.category
                              ),
                          }}
                        />

                        <span>
                          {item.category}
                        </span>

                      </div>

                      <strong>
                        {formatMoney(
                          item.amount
                        )}
                      </strong>

                    </div>
                  )
                )}

              </div>

            </div>

          )}

        </article>


        {/* ====================================
            RECENT EXPENSES
        ==================================== */}

        <article className="dashboard-card">

          <div className="card-header">

            <div>

              <span>
                ACTIVITY
              </span>

              <h2>
                Recent Expenses
              </h2>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/expenses")
              }
            >
              View all →
            </button>

          </div>


          {expenses.length === 0 ? (

            <div className="dashboard-empty">

              <div
                aria-hidden="true"
              >
                💰
              </div>

              <h3>
                No expenses yet
              </h3>

              <p>
                Start tracking your spending
                today.
              </p>

              <button
                type="button"
                className="empty-action"
                onClick={() =>
                  navigate("/expenses")
                }
              >
                Add Expense
              </button>

            </div>

          ) : (

            <div className="recent-expenses">

              {expenses.map(
                (expense) => (

                  <div
                    className="recent-expense"
                    key={expense._id}
                  >

                    {/* ICON */}

                    <div
                      className="recent-icon"
                      aria-hidden="true"
                    >
                      {getCategoryIcon(
                        expense.category
                      )}
                    </div>


                    {/* INFORMATION */}

                    <div className="recent-info">

                      <strong>
                        {expense.title}
                      </strong>

                      <span>
                        {expense.category}
                        {" • "}
                        {expense.paymentMethod}
                      </span>

                      <small>
                        {formatDate(
                          expense.date
                        )}
                      </small>

                    </div>


                    {/* AMOUNT */}

                    <strong
                      className="recent-amount"
                    >
                      {formatMoney(
                        expense.amount
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </article>

      </section>


      {/* ======================================
          TOP CATEGORY
      ====================================== */}

      {topCategory.category && (
        <section
          className="dashboard-top-category"
          aria-label="Top spending category"
        >

          <div>

            <span>
              TOP CATEGORY
            </span>

            <strong>
              {getCategoryIcon(
                topCategory.category
              )}{" "}
              {topCategory.category}
            </strong>

          </div>

          <strong>
            {formatMoney(
              topCategory.amount
            )}
          </strong>

        </section>
      )}


      {/* ======================================
          BOTTOM CTA
      ====================================== */}

      <section className="dashboard-cta">

        <div>

          <span>
            TAKE CONTROL
          </span>

          <h2>
            Make every rupee count.
          </h2>

          <p>
            Keep tracking your expenses
            and understand your spending
            habits.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/expenses")
          }
        >
          Manage Expenses →
        </button>

      </section>

    </main>
  );
}

export default Dashboard;