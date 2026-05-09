import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import '../styles/user.css';

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, logout } = useBooking();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/home', label: 'Explore Map', icon: '🗺️' },
    { path: '/reservations', label: 'Bookings', icon: '🧺' },
    { path: '/notifications', label: 'Alerts', icon: '🔔' },
    { path: '/cart', label: 'Cart', icon: '🛒', showBadge: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDrawerOpen(false);
  };

  return (
    <div className="user-layout">
      {/* Navigation */}
      <nav className={`user-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="flex-center gap-4" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon" style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
          }}>L</div>
          <span className="brand-text desktop-only" style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: 'var(--primary)',
            letterSpacing: '-0.03em'
          }}>LaundryX</span>
        </div>

        <div className="user-nav-links desktop-only" style={{ display: 'flex', gap: '2.5rem' }}>
          {navLinks.map(link => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              className={({ isActive }) => `user-nav-link ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {link.label}
              {link.showBadge && cart.length > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-18px', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold', 
                  padding: '2px 6px', 
                  borderRadius: '50px'
                }}>{cart.length}</span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex-center gap-4">
          <div 
            className="flex-center user-profile-btn" 
            onClick={() => navigate('/profile')}
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.3s',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            👤
          </div>
          <button className="btn btn-primary desktop-only" onClick={handleLogout} style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>Sign Out</button>
          <button className="mobile-only" onClick={() => setIsDrawerOpen(true)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-main)' }}>☰</button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setIsDrawerOpen(false)} />
          <div className="animate-in" style={{ 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            bottom: 0, 
            width: '300px', 
            backgroundColor: 'white', 
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            <div className="flex-between">
              <div className="brand-icon">L</div>
              <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}>✕</button>
            </div>
            <div className="flex-column gap-6">
              {navLinks.map(link => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  style={{ fontSize: '1.2rem', fontWeight: '700', color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem' }}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span style={{ fontSize: '1.5rem' }}>{link.icon}</span> {link.label}
                  {link.showBadge && cart.length > 0 && (
                    <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>{cart.length}</span>
                  )}
                </NavLink>
              ))}
              <NavLink to="/profile" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => setIsDrawerOpen(false)}>
                <span style={{ fontSize: '1.5rem' }}>👤</span> Profile
              </NavLink>
            </div>
            <button className="btn btn-danger mt-auto" onClick={handleLogout} style={{ width: '100%' }}>Sign Out</button>
          </div>
        </div>
      )}

      <main className="user-main">
        <Outlet />
      </main>

      <footer className="premium-footer" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'white', padding: '4rem 0' }}>
        <div className="container">
          <div className="grid-4">
            <div className="flex-column gap-4">
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                <div className="brand-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>L</div>
                <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '1.25rem' }}>LaundryX</span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>Your neighborhood laundry partner. professional washing, drying, and folding services with state-of-the-art machines.</p>
            </div>
            <div className="flex-column gap-3">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ecosystem</h4>
              <NavLink to="/home" className="text-muted">Explore Map</NavLink>
              <NavLink to="/reservations" className="text-muted">My Bookings</NavLink>
              <NavLink to="/notifications" className="text-muted">Alerts</NavLink>
            </div>
            <div className="flex-column gap-3">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company</h4>
              <NavLink to="/about" className="text-muted">About Us</NavLink>
              <NavLink to="/contact" className="text-muted">Contact</NavLink>
              <NavLink to="/privacy" className="text-muted">Privacy Policy</NavLink>
            </div>
            <div className="flex-column gap-4">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Support</h4>
              <p className="text-muted">Help Center</p>
              <p className="text-muted">+1 (555) 000-1234</p>
              <p className="text-muted">hello@laundryx.com</p>
            </div>
          </div>
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>&copy; 2026 LaundryX Pro. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Version 2.4.0</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .mobile-only { display: block !important; }
          .desktop-only { display: none !important; }
          .user-navbar { padding: 0 1.5rem; height: 64px; }
          .user-main { min-height: calc(100vh - 64px); }
        }
        .user-profile-btn:hover {
          border-color: var(--primary) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
        }
      `}</style>
    </div>
  );
}
