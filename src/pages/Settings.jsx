import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBell, FaLock, FaGlobe, FaShieldAlt, FaQuestionCircle, FaChevronRight, FaMoon, FaSun, FaMobileAlt } from 'react-icons/fa';
import '../styles/main.css';

export default function Settings() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    const settingsGroups = [
        {
            title: "Account Settings",
            items: [
                { id: 'profile', icon: <FaUser />, label: 'Edit Profile', value: 'Details, Avatar', link: '/profile' },
                { id: 'password', icon: <FaLock />, label: 'Change Password', value: 'Last changed 3 months ago' },
                { id: 'security', icon: <FaShieldAlt />, label: 'Security & Privacy', value: 'Two-step verification' }
            ]
        },
        {
            title: "Preferences",
            items: [
                { id: 'language', icon: <FaGlobe />, label: 'Language', value: 'English (US)' },
                { id: 'display', icon: darkMode ? <FaMoon /> : <FaSun />, label: 'Appearance', value: darkMode ? 'Dark Mode' : 'Light Mode', isToggle: true, toggleValue: darkMode, onToggle: () => setDarkMode(!darkMode) }
            ]
        },
        {
            title: "Notifications",
            items: [
                { id: 'email-notif', icon: <FaBell />, label: 'Email Notifications', isToggle: true, toggleValue: emailNotifications, onToggle: () => setEmailNotifications(!emailNotifications) },
                { id: 'push-notif', icon: <FaMobileAlt />, label: 'Push Notifications', isToggle: true, toggleValue: pushNotifications, onToggle: () => setPushNotifications(!pushNotifications) }
            ]
        },
        {
            title: "Support",
            items: [
                { id: 'help', icon: <FaQuestionCircle />, label: 'Help Center', value: 'FAQs, Contact' },
                { id: 'about', icon: <FaShieldAlt />, label: 'About LMS Laundry', value: 'Version 2.4.0' }
            ]
        }
    ];

    return (
        <div className="screen settings-screen">
            <div className="section-header">
                <h2 className="page-title">Settings</h2>
                <p className="page-subtitle">Manage your account preferences and application settings.</p>
            </div>

            <div className="settings-container">
                {settingsGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="settings-group">
                        <h3 className="group-title">{group.title}</h3>
                        <div className="settings-list">
                            {group.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="settings-item-card"
                                    onClick={() => item.link ? navigate(item.link) : null}
                                >
                                    <div className="settings-item-icon">
                                        {item.icon}
                                    </div>
                                    <div className="settings-item-info">
                                        <h4 className="settings-item-label">{item.label}</h4>
                                        {item.value && <p className="settings-item-value">{item.value}</p>}
                                    </div>
                                    <div className="settings-item-action">
                                        {item.isToggle ? (
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={item.toggleValue}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        item.onToggle();
                                                    }}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        ) : (
                                            <FaChevronRight className="chevron-icon" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="settings-footer">
                <p>Logged in as <strong>saif@example.com</strong></p>
                <button className="danger-btn-text">Delete Account</button>
            </div>
        </div>
    );
}
