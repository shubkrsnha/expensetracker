import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      {/* LOGO */}

      <div className="sidebar-header">

        {!collapsed && (
          <div className="sidebar-logo">
            <span className="logo-mark">EF</span>
            <span>ExpenseFlow</span>
          </div>
        )}

        {collapsed && (
          <div className="sidebar-logo-collapsed">
            EF
          </div>
        )}

        <button
  type="button"
  className="sidebar-toggle"
  onClick={() =>
    setCollapsed(!collapsed)
  }
  title={
    collapsed
      ? "Expand sidebar"
      : "Collapse sidebar"
  }
>
  {collapsed ? "→" : "←"}
</button>

      </div>


      {/* NAVIGATION */}

      <nav className="sidebar-navigation">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
          title="Dashboard"
        >
          <span className="sidebar-icon">
            ⌂
          </span>

          {!collapsed && (
            <span>Dashboard</span>
          )}
        </NavLink>


        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
          title="Expenses"
        >
          <span className="sidebar-icon">
            ₹
          </span>

          {!collapsed && (
            <span>Expenses</span>
          )}
        </NavLink>


        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
          title="Categories"
        >
          <span className="sidebar-icon">
            ◉
          </span>

          {!collapsed && (
            <span>Categories</span>
          )}
        </NavLink>

      </nav>


      {/* BOTTOM */}

      <div className="sidebar-bottom">

        <button
  type="button"
  className="sidebar-logout"
  onClick={handleLogout}
  title="Logout"
>
  <span className="sidebar-icon">↪</span>

  {!collapsed && (
    <span>Logout</span>
  )}
</button>

      </div>

    </aside>
  );
}

export default Sidebar;