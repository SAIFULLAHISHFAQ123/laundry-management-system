import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaHome, FaHistory, FaCog, FaChevronDown } from 'react-icons/fa';
import '../styles/main.css';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const profileRef = useRef(null);

    // Hardcoded for UI
    const user = { name: "Saif Ur Rehman", email: "saif@example.com" };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    }, [location]);

    if (['/', '/register', '/forgot-password'].includes(location.pathname)) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/home', icon: <FaHome /> },
        { name: 'Bookings', path: '/notifications', icon: <FaHistory /> },
    ];

    return (
        <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="modern-header-container">
                <Link to="/home" className="modern-logo-link">
                    <div className="modern-logo-icon">
                        <span role="img" aria-label="laundry">🧼</span>
                    </div>
                    <h1 className="modern-logo-text">LaundryPro</h1>
                </Link>

                <nav className="modern-desktop-nav">
                    <ul className="modern-nav-list">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link to={link.path} className={`modern-nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="modern-header-actions" ref={profileRef}>
                        <button className={`modern-profile-btn ${isProfileOpen ? 'active' : ''}`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <FaUserCircle className="modern-avatar-icon" />
                            <span className="modern-user-name">{user.name.split(' ')[0]}</span>
                            <FaChevronDown className="modern-chevron" />
                        </button>

                        {isProfileOpen && (
                            <div className="modern-dropdown-menu">
                                <div className="modern-dropdown-header">
                                    <p className="modern-u-name">{user.name}</p>
                                    <p className="modern-u-email">{user.email}</p>
                                </div>
                                <ul className="modern-dropdown-list">
                                    <li><Link to="/profile"><FaUserCircle /> My Profile</Link></li>
                                    <li><Link to="/settings"><FaCog /> Settings</Link></li>
                                    <li className="modern-divider"></li>
                                    <li><button onClick={handleLogout} className="modern-logout-btn"><FaSignOutAlt /> Log Out</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>

                <button className="modern-mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                    <FaBars />
                </button>

                {/* Mobile Navigation Drawer */}
                <div className={`modern-mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
                <aside className={`modern-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="modern-mobile-header">
                        <div className="modern-logo-link">
                            <div className="modern-logo-icon"><span role="img" aria-label="laundry">🧼</span></div>
                            <h2 className="modern-logo-text" style={{ fontSize: '1.25rem' }}>LaundryPro</h2>
                        </div>
                        <button className="modern-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="modern-mobile-content">
                        <div className="modern-mobile-user">
                            <FaUserCircle className="modern-mobile-avatar" />
                            <div>
                                <p className="modern-u-name">{user.name}</p>
                                <Link to="/profile" className="modern-u-email" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}>View Profile</Link>
                            </div>
                        </div>
                        <nav className="modern-mobile-nav">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} className={`modern-mobile-link ${location.pathname === link.path ? 'active' : ''}`}>
                                    {link.icon} {link.name}
                                </Link>
                            ))}
                            <Link to="/settings" className="modern-mobile-link"><FaCog /> Settings</Link>
                            <div className="modern-divider" style={{ margin: '1rem 0' }}></div>
                            <button onClick={handleLogout} className="modern-mobile-link modern-logout-btn"><FaSignOutAlt /> Log Out</button>
                        </nav>
                    </div>
                </aside>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .modern-header {
                    position: sticky; top: 0; z-index: 1000;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                .modern-header.scrolled {
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border-bottom: transparent;
                }
                .modern-header-container {
                    max-width: 1200px; margin: 0 auto; padding: 0.8rem 1.5rem;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .modern-logo-link {
                    display: flex; align-items: center; gap: 0.75rem; text-decoration: none;
                }
                .modern-logo-icon {
                    width: 38px; height: 38px; background: var(--primary); color: white;
                    border-radius: 10px; display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3);
                }
                .modern-logo-text {
                    font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0;
                    letter-spacing: -0.5px;
                }
                .modern-desktop-nav {
                    display: flex; align-items: center; gap: 3rem;
                }
                .modern-nav-list {
                    display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;
                }
                .modern-nav-link {
                    text-decoration: none; color: #64748b; font-weight: 600; font-size: 0.95rem;
                    padding: 0.5rem 0; position: relative; transition: color 0.2s;
                }
                .modern-nav-link:hover { color: var(--primary); }
                .modern-nav-link.active { color: #0f172a; }
                .modern-nav-link.active::after {
                    content: ''; position: absolute; bottom: 0; left: 0; width: 100%;
                    height: 2px; background: var(--primary); border-radius: 2px;
                }
                .modern-header-actions { position: relative; }
                .modern-profile-btn {
                    display: flex; align-items: center; gap: 0.5rem; background: transparent;
                    border: 1px solid #e2e8f0; padding: 0.4rem 1rem 0.4rem 0.4rem; border-radius: 50px;
                    cursor: pointer; transition: all 0.2s;
                }
                .modern-profile-btn:hover, .modern-profile-btn.active {
                    background: #f8fafc; border-color: #cbd5e1;
                }
                .modern-avatar-icon { font-size: 1.8rem; color: var(--primary); }
                .modern-user-name { font-weight: 600; font-size: 0.9rem; color: #334155; }
                .modern-chevron { font-size: 0.7rem; color: #94a3b8; transition: transform 0.2s; }
                .modern-profile-btn.active .modern-chevron { transform: rotate(180deg); }
                
                .modern-dropdown-menu {
                    position: absolute; top: calc(100% + 10px); right: 0;
                    background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    width: 240px; overflow: hidden; border: 1px solid #f1f5f9;
                }
                .modern-dropdown-header { padding: 1.25rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
                .modern-u-name { font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0; }
                .modern-u-email { font-size: 0.8rem; color: #64748b; margin: 0; }
                .modern-dropdown-list { list-style: none; padding: 0.5rem; margin: 0; }
                .modern-dropdown-list a, .modern-dropdown-list button {
                    display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
                    text-decoration: none; color: #475569; font-size: 0.9rem; font-weight: 500;
                    width: 100%; border: none; background: transparent; cursor: pointer;
                    border-radius: 8px; transition: all 0.2s;
                }
                .modern-dropdown-list a:hover, .modern-dropdown-list button:hover {
                    background: #f1f5f9; color: var(--primary);
                }
                .modern-divider { height: 1px; background: #e2e8f0; margin: 0.25rem 0; }
                .modern-logout-btn { color: #ef4444 !important; }
                .modern-logout-btn:hover { background: #fef2f2 !important; color: #dc2626 !important; }

                .modern-mobile-menu-btn {
                    display: none; font-size: 1.5rem; color: #0f172a; background: none; border: none; cursor: pointer;
                }

                @media (max-width: 768px) {
                    .modern-desktop-nav { display: none; }
                    .modern-mobile-menu-btn { display: block; }
                }

                /* Mobile Drawer */
                .modern-mobile-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
                    opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 1050;
                }
                .modern-mobile-overlay.open { opacity: 1; visibility: visible; }
                .modern-mobile-drawer {
                    position: fixed; top: 0; right: -100%; width: 300px; height: 100vh;
                    background: white; z-index: 1060; transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: -10px 0 40px rgba(0,0,0,0.1); display: flex; flex-direction: column;
                }
                .modern-mobile-drawer.open { right: 0; }
                .modern-mobile-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1.5rem; border-bottom: 1px solid #f1f5f9;
                }
                .modern-close-btn {
                    background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; color: #64748b;
                    cursor: pointer; transition: all 0.2s;
                }
                .modern-close-btn:hover { background: #e2e8f0; color: #0f172a; }
                .modern-mobile-content { padding: 1.5rem; overflow-y: auto; }
                .modern-mobile-user {
                    display: flex; align-items: center; gap: 1rem; padding-bottom: 1.5rem;
                    border-bottom: 1px solid #f1f5f9; margin-bottom: 1.5rem;
                }
                .modern-mobile-avatar { font-size: 3rem; color: var(--primary); }
                .modern-mobile-nav { display: flex; flex-direction: column; gap: 0.5rem; }
                .modern-mobile-link {
                    display: flex; align-items: center; gap: 1rem; padding: 1rem;
                    text-decoration: none; color: #475569; font-weight: 600; font-size: 1rem;
                    border-radius: 12px; transition: all 0.2s;
                }
                .modern-mobile-link.active { background: #f0f9ff; color: var(--primary); }
                `
            }} />
        </header>
    );
}
