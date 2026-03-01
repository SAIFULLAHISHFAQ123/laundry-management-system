import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserShield, FaSignOutAlt, FaTachometerAlt, FaCog, FaChevronDown } from 'react-icons/fa';
import '../styles/main.css';

export default function AdminHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const profileRef = useRef(null);

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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
        { name: 'Profile', path: '/admin/profile', icon: <FaUserShield /> },
    ];

    const user = { name: "System Admin", email: "admin@sparklewash.com" };

    return (
        <header className={`app-header admin-header-theme ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/admin" className="logo-link">
                    <div className="logo-icon-wrapper" style={{ background: '#1e293b' }}>
                        <FaUserShield style={{ color: 'white', fontSize: '1.2rem' }} />
                    </div>
                    <div className="logo-text-wrapper">
                        <h1 className="logo-title" style={{ color: '#0f172a' }}>Admin Portal</h1>
                    </div>
                </Link>

                <nav className="desktop-nav">
                    <ul className="nav-list">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="header-actions">
                        <div className="profile-dropdown-container" ref={profileRef}>
                            <button className={`profile-toggle-btn ${isProfileOpen ? 'active' : ''}`} onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ background: '#f8fafc' }}>
                                <div className="user-avatar-small" style={{ color: '#334155' }}>
                                    <FaUserShield />
                                </div>
                                <span className="user-name-text">Admin</span>
                                <FaChevronDown className="chevron-icon" />
                            </button>

                            {isProfileOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-info" style={{ background: '#e2e8f0' }}>
                                        <p className="u-name">{user.name}</p>
                                        <p className="u-email">{user.email}</p>
                                    </div>
                                    <ul className="dropdown-list">
                                        <li><Link to="/admin/profile"><FaUserShield /> Admin Settings</Link></li>
                                        <li className="divider"></li>
                                        <li><button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Secure Logout</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                    <FaBars />
                </button>

                <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
                <aside className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-nav-header">
                        <FaUserShield style={{ fontSize: '1.5rem', color: '#1e293b' }} />
                        <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}><FaTimes /></button>
                    </div>
                    <div className="mobile-nav-content">
                        <div className="m-user-box" style={{ background: '#f1f5f9' }}>
                            <FaUserShield className="m-avatar" style={{ color: '#334155' }} />
                            <div>
                                <p className="m-name">{user.name}</p>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Super Admin</span>
                            </div>
                        </div>
                        <ul className="m-nav-list">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="m-nav-item">
                                        {link.icon} {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="m-divider"></li>
                            <li><button onClick={handleLogout} className="m-logout-btn"><FaSignOutAlt /> Secure Logout</button></li>
                        </ul>
                    </div>
                </aside>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-header-theme {
                    border-bottom: 2px solid #e2e8f0;
                    background: #ffffff;
                }
                .admin-header-theme .nav-link.active {
                    color: #0f172a;
                    font-weight: 700;
                    border-bottom: 2px solid #0f172a;
                }
                `
            }} />
        </header>
    );
}
