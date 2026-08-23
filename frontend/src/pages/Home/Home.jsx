import { useNavigate } from "react-router-dom";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">
            SIMPLE • SMART • SECURE
          </span>

          <h1>
            Take control of
            <br />
            your <span>expenses.</span>
          </h1>

          <p>
            ExpenseFlow helps you track your
            spending, understand your habits,
            and make better financial decisions.
          </p>

          <div className="home-buttons">
            <button
              type="button"
              className="home-primary-button"
              onClick={() => navigate("/register")}
            >
              <span>Start Tracking</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="home-secondary-button"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="home-visual">
          <div className="home-card">
            <div className="home-card-header">
              <span>Monthly Spending</span>
              <span>August</span>
            </div>

            <strong>₹24,850</strong>

            <div
              className="home-chart"
              aria-label="Monthly spending chart"
            >
              <div style={{ height: "45%" }}></div>
              <div style={{ height: "65%" }}></div>
              <div style={{ height: "40%" }}></div>
              <div style={{ height: "80%" }}></div>
              <div style={{ height: "55%" }}></div>
              <div style={{ height: "90%" }}></div>
              <div style={{ height: "70%" }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feature">
          <span>01</span>

          <h3>Track Expenses</h3>

          <p>
            Record your daily transactions
            in seconds.
          </p>
        </div>

        <div className="feature">
          <span>02</span>

          <h3>Understand Spending</h3>

          <p>
            See where your money goes
            through useful analytics.
          </p>
        </div>

        <div className="feature">
          <span>03</span>

          <h3>Make Better Decisions</h3>

          <p>
            Use your spending patterns
            to build better habits.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;