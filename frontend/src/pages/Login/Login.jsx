import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

const API_URL = "";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: formData.password,
          }),
        }
      );

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Invalid email or password."
        );
      }

      const token =
        result.token ||
        result.data?.token ||
        result.accessToken;

      if (!token) {
        throw new Error(
          "Login succeeded but no token was returned."
        );
      }

      localStorage.setItem("token", token);

      const user =
        result.user ||
        result.data?.user;

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        {/* LEFT SIDE */}

        <section className="login-introduction">
          <div className="login-brand">
            <span className="login-brand-icon">↔</span>
            <span>ExpenseFlow</span>
          </div>

          <div className="login-introduction-content">
            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Your money.
              <br />
              Your control.
            </h1>

            <p>
              Track your expenses, understand
              your spending habits, and stay
              in control of your finances.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}

        <section className="login-card">
          <div className="login-header">
            <h2>Welcome back</h2>

            <p>
              Sign in to continue to ExpenseFlow.
            </p>
          </div>

          {error && (
            <div
              className="login-error"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </span>

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="login-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;