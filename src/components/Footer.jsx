import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaShieldAlt, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import '../styles/main.css';

export default function Footer() {
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    if (['/', '/register', '/forgot-password', '/admin'].includes(location.pathname) || location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="modern-footer">
            <div className="modern-footer-container">
                <div className="modern-footer-grid">
                    {/* Brand Column */}
                    <div className="modern-footer-brand">
                        <Link to="/home" className="modern-logo-link" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
                            <div className="modern-logo-icon" style={{ background: 'white', color: 'var(--primary)' }}>
                                <span role="img" aria-label="laundry">🧼</span>
                            </div>
                            <h2 className="modern-logo-text" style={{ color: 'white' }}>LaundryPro</h2>
                        </Link>
                        <p className="modern-footer-desc">
                            The most trusted name in laundry care. We provide professional cleaning services with a focus on quality, speed, and environmental sustainability.
                        </p>
                        <div className="modern-social-links">
                            <a href="#" className="modern-social-icon" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="#" className="modern-social-icon" aria-label="Twitter"><FaTwitter /></a>
                            <a href="#" className="modern-social-icon" aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" className="modern-social-icon" aria-label="LinkedIn"><FaLinkedinIn /></a>
                        </div>
                    </div>

                    {/* Quick links & Pages */}
                    <div className="modern-footer-links-col">
                        <h3 className="modern-footer-heading">Help & Support</h3>
                        <ul className="modern-footer-list">
                            <li><Link to="/help"><FaQuestionCircle className="modern-li-icon" /> Help Center</Link></li>
                            <li><Link to="/notifications">Order Status</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy"><FaShieldAlt className="modern-li-icon" /> Privacy Policy</Link></li>
                            <li><Link to="/faq">Self-Pickup Guide</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="modern-footer-contact-col">
                        <h3 className="modern-footer-heading">Contact Us</h3>
                        <ul className="modern-footer-list">
                            <li className="modern-contact-item">
                                <FaPhoneAlt className="modern-contact-icon" />
                                <span>+92 312 3456789</span>
                            </li>
                            <li className="modern-contact-item">
                                <FaEnvelope className="modern-contact-icon" />
                                <span>support@lmslaundry.com</span>
                            </li>
                            <li className="modern-contact-item">
                                <FaMapMarkerAlt className="modern-contact-icon modern-map-icon" />
                                <span>123 Blue Area, Islamabad, Pakistan</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="modern-footer-newsletter">
                        <h3 className="modern-footer-heading">Stay Clean & Fresh</h3>
                        <p className="modern-newsletter-text">Subscribe to get special offers, free laundry tips and once-in-a-lifetime deals.</p>
                        <form className="modern-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="modern-newsletter-input-group">
                                <input type="email" placeholder="Your email address" required className="modern-newsletter-input" />
                                <button type="submit" className="modern-newsletter-btn" aria-label="Subscribe">
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="modern-footer-bottom">
                    <div className="modern-footer-copyright">
                        <p>&copy; {currentYear} LMS Laundry Management System. Built with ❤️ for your clothes.</p>
                    </div>
                    <div className="modern-footer-bottom-links">
                        <Link to="/about"><FaInfoCircle style={{ marginRight: '6px' }} /> About Us</Link>
                        <span className="modern-dot-separator">•</span>
                        <Link to="/careers">Careers</Link>
                        <span className="modern-dot-separator">•</span>
                        <Link to="/blog">Blog</Link>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .modern-footer {
                    background: #0f172a; color: #f8fafc; padding: 5rem 0 0 0; font-family: 'Inter', sans-serif;
                    position: relative; overflow: hidden;
                }
                .modern-footer::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
                    background: linear-gradient(90deg, var(--primary), #38bdf8, var(--primary));
                }
                .modern-footer-container {
                    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
                }
                .modern-footer-grid {
                    display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 4rem; padding-bottom: 4rem;
                }
                .modern-footer-desc {
                    color: #94a3b8; line-height: 1.7; margin-bottom: 2rem; font-size: 0.95rem; max-width: 320px;
                }
                .modern-social-links { display: flex; gap: 1rem; }
                .modern-social-icon {
                    width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: center; color: white;
                    text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .modern-social-icon:hover {
                    background: var(--primary); transform: translateY(-3px); border-color: var(--primary);
                    box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
                }
                .modern-footer-heading {
                    font-size: 1.1rem; font-weight: 700; color: white; margin-top: 0; margin-bottom: 1.5rem;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
                .modern-footer-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
                .modern-footer-list a {
                    color: #94a3b8; text-decoration: none; transition: all 0.2s; font-size: 0.95rem;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .modern-footer-list a:hover { color: #38bdf8; transform: translateX(5px); }
                .modern-li-icon { font-size: 0.9rem; color: #475569; transition: color 0.2s; }
                .modern-footer-list a:hover .modern-li-icon { color: #38bdf8; }
                
                .modern-contact-item {
                    display: flex; align-items: flex-start; gap: 1rem; color: #94a3b8; font-size: 0.95rem; line-height: 1.5;
                }
                .modern-contact-icon { color: var(--primary); font-size: 1.1rem; flex-shrink: 0; margin-top: 0.2rem; }
                
                .modern-newsletter-text { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
                .modern-newsletter-input-group {
                    display: flex; background: rgba(255,255,255,0.05); border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.1); overflow: hidden; padding: 0.25rem;
                    transition: border-color 0.3s;
                }
                .modern-newsletter-input-group:focus-within { border-color: var(--primary); background: rgba(255,255,255,0.1); }
                .modern-newsletter-input {
                    flex-grow: 1; background: transparent; border: none; padding: 0.75rem 1.25rem; color: white; outline: none;
                    font-size: 0.95rem; font-family: inherit;
                }
                .modern-newsletter-input::placeholder { color: #64748b; }
                .modern-newsletter-btn {
                    background: var(--primary); color: white; border: none; width: 46px; height: 46px;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
                }
                .modern-newsletter-btn:hover { background: #0284c7; transform: scale(1.05); }

                .modern-footer-bottom {
                    display: flex; justify-content: space-between; align-items: center; padding: 2rem 0;
                    border-top: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap; gap: 1rem;
                }
                .modern-footer-copyright p { color: #64748b; margin: 0; font-size: 0.9rem; }
                .modern-footer-bottom-links { display: flex; align-items: center; gap: 1rem; }
                .modern-footer-bottom-links a { color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; display: flex; align-items: center; }
                .modern-footer-bottom-links a:hover { color: white; }
                .modern-dot-separator { color: #475569; font-size: 0.8rem; }

                @media (max-width: 1024px) {
                    .modern-footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
                }
                @media (max-width: 640px) {
                    .modern-footer-grid { grid-template-columns: 1fr; gap: 2.5rem; }
                    .modern-footer-bottom { flex-direction: column; justify-content: center; text-align: center; }
                    .modern-footer-bottom-links { justify-content: center; flex-wrap: wrap; }
                }
                `
            }} />
        </footer>
    );
}
