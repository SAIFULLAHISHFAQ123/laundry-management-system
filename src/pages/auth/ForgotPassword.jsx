import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/auth.css';

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
    <div className="screen center auth-page-bg">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Reset your password in seconds</p>
        
        {message && <div className="error-message" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>{message}</div>}
        
        <div className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          
          <button onClick={handleReset} className="auth-btn">
            Send Reset Link
          </button>
        </div>
        
        <div className="auth-footer-link">
          <p>
            <span style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '700' }} onClick={() => navigate("/")}>
              ← Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}