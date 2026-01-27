import React, { useState } from "react";
import api from "./services/api";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    adminCode: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, formData);

      if (response.data.success) {
        if (isLogin) {
          localStorage.setItem("token", response.data.data.token);
          window.location.href = "/"; // Refresh to trigger auth check or redirect
        } else {
          setMessage("Registration successful! Please login.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <div className="authHeader">
          <h2>{isLogin ? "Login" : "Create Account"}</h2>
          <p>
            {isLogin
              ? "Welcome back to TaskManager"
              : "Join our task management community"}
          </p>
        </div>

        {error && <div className="errorMsg">{error}</div>}
        {message && <div className="successMsg">{message}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="formGroup">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="formGroup">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="formGroup">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--input-bg)",
                }}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          {!isLogin && formData.role === "ADMIN" && (
            <div className="formGroup">
              <label htmlFor="adminCode">Admin Registration Code</label>
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                placeholder="Enter secret code"
                required
                value={formData.adminCode}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="toggleAuth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
