import { useState } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import '../styles/user.css';

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, logout } = useBooking();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { path: '/home', label: 'Explore Map', icon: '🗺️' },
    { path: '/reservations', label: 'My Bookings', icon: '🧺' },
    { path: '/notifications', label: 'Alerts', icon: '🔔' },
    { path: '/cart', label: 'Cart', icon: '🛒', showBadge: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="main-layout">
      {/* Mobile Drawer Overlay */}
      <div
        className={`drawer-overlay ${isDrawerOpen ? 'active' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="flex-between mb-8">
          <div className="nav-brand">
            <div className="brand-icon">L</div>
            <span className="brand-text">LaundryX</span>
          </div>
          <button className="menu-toggle" onClick={() => setIsDrawerOpen(false)}>✕</button>
        </div>

        <nav className="flex-column gap-2">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{link.icon}</span>
                <span>{link.label}</span>
                {link.showBadge && cart.length > 0 && (
                  <span className="cart-badge" style={{ position: 'static', transform: 'none', marginLeft: 'auto' }}>
                    {cart.length}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsDrawerOpen(false)}
          >
            <span style={{ fontSize: '1.25rem' }}>👤</span>
            <span>Profile</span>
          </NavLink>

          <button
            className="btn btn-danger mt-8"
            style={{ justifyContent: 'flex-start' }}
            onClick={handleLogout}
          >
            🔒 Sign Out
          </button>
        </nav>
      </div>

      {/* Premium Navbar */}
      <nav className="premium-nav">
        <div className="nav-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">L</div>
          <span className="brand-text desktop-only">LaundryX</span>
        </div>

        {/* Desktop Links (Main Navigation) */}
        <div className="nav-links">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {link.label}
              {link.showBadge && cart.length > 0 && (
                <span className="cart-badge" style={{ top: '-5px', right: '-15px', border: '2px solid white' }}>
                  {cart.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {/* 1. Profile (Moved to First position) */}
          <div
            className="user-profile-circle desktop-only"
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
            title="Profile"
          >
            👤
          </div>

          {/* 2. Logout */}
          <button className="btn-logout desktop-only" onClick={handleLogout}>
            Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button className="menu-toggle" onClick={toggleDrawer}>
            ☰
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="premium-footer">
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          &copy; 2026 Laundry Management System. All rights reserved.<br />
          <small>Version 2.4.0 (Pro) • Made for Your Convenience</small>
        </p>
      </footer>
    </div>
  );
}

