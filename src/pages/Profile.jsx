import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const user = {
    name: "Saif Ur Rehman",
    email: "saif@example.com",
    phone: "+92 312 3456789",
    location: "Rawalpindi, Pakistan",
    memberSince: "Jan 2026",
    bookings: 12,
    points: 450
  };

  const handleLogout = () => {
    // Logic to clear session
    navigate('/');
  };

  return (
    <div className="screen profile-screen">
      {/* Profile Header Card */}
      <div className="user-header-card">
        <div className="user-avatar-large">
          <span className="avatar-initials">SR</span>
          <button className="edit-avatar-btn">✏️</button>
        </div>
        <div className="user-details-main">
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
          <div className="user-stats-row">
            <div className="user-stat">
              <span className="stat-value">{user.bookings}</span>
              <span className="stat-label">Bookings</span>
            </div>
            <div className="user-stat divider"></div>
            <div className="user-stat">
              <span className="stat-value">{user.points}</span>
              <span className="stat-label">Points</span>
            </div>
            <div className="user-stat divider"></div>
            <div className="user-stat">
              <span className="stat-value">Gold</span>
              <span className="stat-label">Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="profile-menu-grid">
        <div className="menu-card" onClick={() => navigate('/notifications')}>
          <div className="menu-icon-bg pink">📅</div>
          <div className="menu-info">
            <h3>My Bookings</h3>
            <p>View past & active orders</p>
          </div>
          <span className="menu-arrow">→</span>
        </div>

        <div className="menu-card">
          <div className="menu-icon-bg blue">💳</div>
          <div className="menu-info">
            <h3>Payment Methods</h3>
            <p>Manage cards & wallets</p>
          </div>
          <span className="menu-arrow">→</span>
        </div>

        <div className="menu-card">
          <div className="menu-icon-bg green">📍</div>
          <div className="menu-info">
            <h3>Saved Addresses</h3>
            <p>Home, Office, etc.</p>
          </div>
          <span className="menu-arrow">→</span>
        </div>

        <div className="menu-card">
          <div className="menu-icon-bg orange">🎁</div>
          <div className="menu-info">
            <h3>Promotions</h3>
            <p>Offers & coupons</p>
          </div>
          <span className="menu-arrow">→</span>
        </div>

        <div className="menu-card">
          <div className="menu-icon-bg purple">⚙️</div>
          <div className="menu-info">
            <h3>Settings</h3>
            <p>Notifications, Password</p>
          </div>
          <span className="menu-arrow">→</span>
        </div>

        <div className="menu-card">
          <div className="menu-icon-bg cyan">❓</div>
          <div className="menu-info">
            <h3>Help & Support</h3>
            <p>FAQs, Contact Us</p>
          </div>
          <span className="menu-arrow">→</span>
        </div>
      </div>

      {/* Logout Button */}
      {/* Profile Actions - Removed Redundant Logout */}
    </div>
  );
}
