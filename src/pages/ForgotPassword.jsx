import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }
    
    setMessage("Password reset link has been sent to your email");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">Reset your password in seconds</p>
          </div>
          
          {message && <div className="auth-success">{message}</div>}
          
          <div className="forgot-password-note">
            Enter your registered email address and we'll send you a link to reset your password.
          </div>
          
          <div className="auth-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            
            <button onClick={handleReset} className="auth-button">
              Send Reset Link
            </button>
          </div>
          
          <div className="auth-footer">
            <span className="auth-link-text" onClick={() => navigate("/")}>
              ← Back to Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}