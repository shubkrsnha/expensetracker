import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import "./PublicNavbar.css";

function PublicNavbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="public-header">
      <Link
        to="/"
        className="public-logo"
      >
        <span className="public-logo-icon">↔</span>

        <span>
          Expense<span>Flow</span>
        </span>
      </Link>

      <nav className="public-navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "public-nav-link active"
              : "public-nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "public-nav-link active"
              : "public-nav-link"
          }
        >
          About Us
        </NavLink>
      </nav>

      <div className="public-actions">
        {token ? (
          <>
            <button
              type="button"
              className="public-dashboard-button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="public-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="public-login-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              type="button"
              className="public-start-button"
              onClick={() => navigate("/register")}
            >
              <span>Get Started</span>
              <span>→</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default PublicNavbar;