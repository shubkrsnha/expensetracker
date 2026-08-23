import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <main className="about-page">
      {/* HERO */}

      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            ABOUT EXPENSEFLOW
          </span>

          <h1>
            Take control of
            <br />
            <span>your money.</span>
          </h1>

          <p>
            ExpenseFlow helps you understand where
            your money goes, track your daily expenses,
            and make smarter financial decisions.
          </p>

          <div className="about-hero-actions">
            <button
              type="button"
              className="about-primary-button"
              onClick={() => navigate("/register")}
            >
              <span>Get Started</span>
              <span>→</span>
            </button>

            <button
              type="button"
              className="about-secondary-button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* VISUAL */}

        <div className="about-hero-visual">
          <div className="visual-card">
            <div className="visual-card-header">
              <div>
                <span>MONTHLY SPENDING</span>

                <strong>₹42,350</strong>
              </div>

              <div className="visual-icon">
                ₹
              </div>
            </div>

            <div className="visual-chart">
              <div className="chart-bar bar-1"></div>
              <div className="chart-bar bar-2"></div>
              <div className="chart-bar bar-3"></div>
              <div className="chart-bar bar-4"></div>
              <div className="chart-bar bar-5"></div>
              <div className="chart-bar bar-6"></div>
              <div className="chart-bar bar-7"></div>
            </div>

            <div className="visual-footer">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>

          <div className="floating-card">
            <span>THIS MONTH</span>

            <strong>+18.5%</strong>

            <small>
              Better spending control
            </small>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}

      <section className="about-intro">
        <div className="about-section-label">
          WHY EXPENSEFLOW
        </div>

        <div className="about-intro-content">
          <h2>
            Your finances shouldn't
            <br />
            feel complicated.
          </h2>

          <p>
            Managing personal expenses often means
            spreadsheets, notes, banking apps and
            complicated calculations.
          </p>

          <p>
            ExpenseFlow brings everything together in
            one simple place. Track expenses, organize
            spending by category and understand your
            financial habits through clear analytics.
          </p>
        </div>
      </section>

      {/* FEATURES */}

      <section className="about-features">
        <div className="about-section-heading">
          <span>WHAT WE OFFER</span>

          <h2>
            Everything you need to
            <br />
            understand your spending.
          </h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-number">
              01
            </div>

            <div className="feature-icon">
              ₹
            </div>

            <h3>Track Expenses</h3>

            <p>
              Record your daily expenses and keep
              all your transactions organized in one
              place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">
              02
            </div>

            <div className="feature-icon">
              ◉
            </div>

            <h3>Categorize Spending</h3>

            <p>
              Understand where your money goes by
              organizing expenses into meaningful
              categories.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">
              03
            </div>

            <div className="feature-icon">
              ↗
            </div>

            <h3>Analyze Your Money</h3>

            <p>
              Visualize spending patterns and discover
              insights that help you make better
              financial decisions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">
              04
            </div>

            <div className="feature-icon">
              ✓
            </div>

            <h3>Stay Organized</h3>

            <p>
              Keep your financial activity structured,
              searchable and easy to understand.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="about-process">
        <div className="about-process-heading">
          <span>HOW IT WORKS</span>

          <h2>Simple by design.</h2>
        </div>

        <div className="process-grid">
          <div className="process-item">
            <div className="process-circle">
              1
            </div>

            <h3>Add your expenses</h3>

            <p>
              Record what you spend as you go.
            </p>
          </div>

          <div
            className="process-line"
            aria-hidden="true"
          ></div>

          <div className="process-item">
            <div className="process-circle">
              2
            </div>

            <h3>Organize</h3>

            <p>
              Categorize your transactions.
            </p>
          </div>

          <div
            className="process-line"
            aria-hidden="true"
          ></div>

          <div className="process-item">
            <div className="process-circle">
              3
            </div>

            <h3>Understand</h3>

            <p>
              Use analytics to understand your habits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="about-cta">
        <div>
          <span>START TODAY</span>

          <h2>Make every rupee count.</h2>

          <p>
            Start tracking your expenses and build
            better financial habits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
        >
          <span>Create Free Account</span>
          <span>→</span>
        </button>
      </section>

      {/* FOOTER */}

      <footer className="about-footer">
        <div className="about-footer-logo">
          <div>EF</div>

          <strong>ExpenseFlow</strong>
        </div>

        <p>
          Simple expense tracking for smarter
          financial decisions.
        </p>

        <span>© 2026 ExpenseFlow</span>
      </footer>
    </main>
  );
}

export default About;