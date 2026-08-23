import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const API_URL = "";

const CATEGORY_CONFIG = {
  Food: {
    icon: "🍴",
    color: "#4caf50",
  },
  Shopping: {
    icon: "🛍️",
    color: "#ff9800",
  },
  Transport: {
    icon: "🚗",
    color: "#2196f3",
  },
  Entertainment: {
    icon: "🎬",
    color: "#9c27b0",
  },
  Utilities: {
    icon: "⚡",
    color: "#f44336",
  },
  Other: {
    icon: "💳",
    color: "#78909c",
  },
};

function Categories() {
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/analytics/category`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to fetch category analytics");
      }

      const result = await response.json();

      const categories =
        result.analytics?.categories ||
        result.categories ||
        result.data ||
        [];

      setCategoryData(
        Array.isArray(categories) ? categories : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load categories"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCategoryData();
  }, [token, navigate, fetchCategoryData]);

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const totalSpending = categoryData.reduce(
    (total, category) =>
      total + Number(category.amount || 0),
    0
  );

  const getPercentage = (amount) => {
    if (totalSpending === 0) {
      return 0;
    }

    return (Number(amount || 0) / totalSpending) * 100;
  };

  const getTopCategory = () => {
    if (categoryData.length === 0) {
      return "—";
    }

   const topCategory = categoryData.reduce(
  (highest, category) => {
    const highestAmount = Number(highest.amount || 0);
    const categoryAmount = Number(category.amount || 0);

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

    return topCategory.category || "—";
  };

  if (loading) {
    return (
      <main className="categories-page">
        <div className="categories-loading">
          <div className="categories-spinner"></div>

          <p>Loading your categories...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="categories-page">
      <section className="categories-header">
        <div>
          <span className="categories-eyebrow">
            EXPENSE TRACKER
          </span>

          <h1>Spending Categories</h1>

          <p>
            Understand where your money is going and manage
            your spending better.
          </p>
        </div>

        <button
          type="button"
          className="expenses-add-button"
          onClick={() => navigate("/expenses")}
        >
          <span className="add-icon">+</span>
          <span>Add Expense</span>
        </button>
      </section>

      {error && (
        <div className="categories-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchCategoryData}
          >
            Try Again
          </button>
        </div>
      )}

      <section className="categories-overview">
        <div className="overview-card">
          <span>TOTAL SPENDING</span>

          <strong>{formatMoney(totalSpending)}</strong>

          <p>Across all categories</p>
        </div>

        <div className="overview-card">
          <span>CATEGORIES</span>

          <strong>{categoryData.length}</strong>

          <p>Active spending categories</p>
        </div>

        <div className="overview-card">
          <span>TOP CATEGORY</span>

          <strong>{getTopCategory()}</strong>

          <p>Highest spending</p>
        </div>
      </section>

      <section className="categories-card">
        <div className="categories-card-header">
          <div>
            <span>BREAKDOWN</span>

            <h2>Your Categories</h2>
          </div>

          <span className="category-count">
            {categoryData.length} categories
          </span>
        </div>

        {categoryData.length === 0 ? (
          <div className="categories-empty">
            <div className="categories-empty-icon">
              📊
            </div>

            <h3>No spending data</h3>

            <p>
              Start adding expenses and your category
              breakdown will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/expenses")}
            >
              <span>+</span>
              <span>Add Your First Expense</span>
            </button>
          </div>
        ) : (
          <div className="category-items">
            {categoryData.map((category, index) => {
              const config =
                CATEGORY_CONFIG[category.category] || {
                  icon: "💳",
                  color: "#78909c",
                };

              const percentage = getPercentage(
                category.amount
              );

              return (
                <div
                  className="category-item"
                  key={category.category || index}
                >
                  <div
                    className="category-icon"
                    style={{
                      backgroundColor: `${config.color}18`,
                    }}
                  >
                    {config.icon}
                  </div>

                  <div className="category-main">
                    <div className="category-top">
                      <div>
                        <strong>
                          {category.category}
                        </strong>

                        <span>
                          {percentage.toFixed(1)}
                          % of total
                        </span>
                      </div>

                      <strong className="category-amount">
                        {formatMoney(category.amount)}
                      </strong>
                    </div>

                    <div className="category-progress">
                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: config.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="categories-action">
        <div>
          <span>MANAGE YOUR SPENDING</span>

          <h2>
            Want to see all your transactions?
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate("/expenses")}
        >
          <span>View Expenses</span>
          <span>→</span>
        </button>
      </section>
    </main>
  );
}

export default Categories;