import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaServer, FaShieldAlt } from 'react-icons/fa';
import '../styles/main.css';

export default function AdminFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer section-padding admin-footer-theme" style={{ background: '#0f172a', color: '#cbd5e1' }}>
            <div className="container">
                <div className="footer-top" style={{ borderBottom: '1px solid #334155', paddingBottom: '2rem' }}>
                    <div className="footer-brand-col">
                        <div className="footer-logo">
                            <span className="logo-emoji"><FaUserShield style={{ color: '#38bdf8' }} /></span>
                            <h2 className="footer-title" style={{ color: 'white' }}>Admin Portal</h2>
                        </div>
                        <p className="footer-desc" style={{ color: '#94a3b8' }}>
                            Secure management interface for LMS Laundry operations, monitoring, and configurations.
                        </p>
                    </div>

                    <div className="footer-nav-groups">
                        <div className="footer-col">
                            <h3 className="footer-heading" style={{ color: 'white' }}>Quick Links</h3>
                            <ul className="footer-links-list">
                                <li><Link to="/admin" style={{ color: '#94a3b8' }}>Dashboard Overview</Link></li>
                                <li><Link to="/admin/update-price" style={{ color: '#94a3b8' }}>Pricing Engine</Link></li>
                                <li><Link to="/admin/profile" style={{ color: '#94a3b8' }}>Account Security</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3 className="footer-heading" style={{ color: 'white' }}>System</h3>
                            <ul className="footer-contact-list">
                                <li style={{ color: '#94a3b8' }}>
                                    <FaServer className="contact-icon" style={{ color: '#38bdf8' }} />
                                    <span>Server Status: Operational</span>
                                </li>
                                <li style={{ color: '#94a3b8' }}>
                                    <FaShieldAlt className="contact-icon" style={{ color: '#38bdf8' }} />
                                    <span>AES-256 Encrypted</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom" style={{ paddingTop: '1.5rem', color: '#64748b' }}>
                    <div className="footer-copyright">
                        <p>&copy; {currentYear} LMS Laundry Enterprise. All rights reserved.</p>
                    </div>
                    <div className="footer-bottom-links">
                        <span style={{ fontSize: '0.8rem' }}>v2.4.1 Build</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
