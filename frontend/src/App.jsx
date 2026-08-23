import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Dashboard from "./pages/Dashboard/Dashboard";
import Expenses from "./pages/Expenses/Expenses";
import Categories from "./pages/Categories/Categories";

import PublicNavbar from "./components/PublicNavbar/PublicNavbar";
import Sidebar from "./components/Sidebar/Sidebar";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>

      {/* PUBLIC PAGES */}

      <Route
        path="/"
        element={
          <>
            <PublicNavbar />
            <Home />
          </>
        }
      />

      <Route
        path="/about"
        element={
          <>
            <PublicNavbar />
            <About />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <PublicNavbar />
            <Login />
          </>
        }
      />

      <Route
        path="/register"
        element={
          <>
            <PublicNavbar />
            <Register />
          </>
        }
      />

      {/* PROTECTED PAGES */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="app-content">
                <Dashboard />
              </main>
            </div>
          }
        />

        <Route
          path="/expenses"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="app-content">
                <Expenses />
              </main>
            </div>
          }
        />

        <Route
          path="/categories"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="app-content">
                <Categories />
              </main>
            </div>
          }
        />

      </Route>

    </Routes>
  );
}

export default App;