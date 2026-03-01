import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hardcoded admin credentials
  const hardcodedAdmin = {
    email: "admin@gmail.com",
    password: "12345",
    role: "Admin"
  };
  const hardcodedUser = {
    email: "saifullahishfaq5@gmail.com",
    password: "123456",
    role: "User"
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check hardcoded admin first
      if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
        localStorage.setItem("token", "hardcoded-admin-token");
        localStorage.setItem("role", "Admin");
        navigate("/admin");
        return;
      }
      // Check hardcoded normal user
      if (email === hardcodedUser.email && password === hardcodedUser.password) {
        localStorage.setItem("token", "hardcoded-user-token");
        localStorage.setItem("role", "User");
        navigate("/home");
        return;
      }
      // Normal API login
      const res = await fetch("https://localhost:7208/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Server error. Please try again later.");
      }

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "Admin") navigate("/admin");
      else navigate("/home");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen center auth-page-bg">
      <div className="auth-card">
        <h2 className="auth-title">LaundryStream Login</h2>
        <p className="auth-subtitle">Login with your email and password</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer-link">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
