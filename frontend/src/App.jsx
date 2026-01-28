import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./Auth";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import api from "./services/api";
import TaskDashboard from "./TaskDashboard";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Toaster position="top-center" />
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user.role === "ADMIN" ? (
                    <AdminDashboard />
                  ) : (
                    <TaskDashboard />
                  )
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/auth"
              element={!user ? <Auth /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
