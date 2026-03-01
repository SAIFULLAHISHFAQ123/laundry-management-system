import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserShield, FaSignOutAlt, FaEdit } from "react-icons/fa";

export default function AdminProfile() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear admin auth tokens here
        navigate("/");
    };

    return (
        <div className="admin-screen screen">
            <div className="process-header">
                <button className="back-button-professional" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h2>Admin Profile</h2>
                    <p className="subtitle">Manage your account settings.</p>
                </div>
            </div>

            <div className="flow-container">
                <div className="selection-card">
                    <div className="profile-header-card">
                        <div className="profile-avatar">
                            <FaUserShield />
                        </div>
                        <div className="profile-details">
                            <h3>System Administrator</h3>
                            <p>admin@sparklewash.com</p>
                            <div className="role-badge">Super Admin</div>
                        </div>
                        <button className="edit-profile-btn"><FaEdit /></button>
                    </div>

                    <div className="profile-settings-list">
                        <div className="settings-item">
                            <div className="settings-info">
                                <h4>Change Password</h4>
                                <p>Update your admin login password</p>
                            </div>
                            <button className="secondary-btn-pro" style={{ padding: '0.5rem 1rem' }}>Update</button>
                        </div>

                        <div className="settings-item">
                            <div className="settings-info">
                                <h4>Notification Preferences</h4>
                                <p>Manage email and SMS push alerts for new branches</p>
                            </div>
                            <button className="secondary-btn-pro" style={{ padding: '0.5rem 1rem' }}>Manage</button>
                        </div>
                    </div>
                </div>

                <button className="danger-btn-pro" onClick={handleLogout} style={{ marginTop: '2rem', width: '100%' }}>
                    <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout Admin session
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .profile-header-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid var(--border);
          position: relative;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        .profile-details h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.25rem;
          color: var(--text-main);
        }
        .profile-details p {
          margin: 0 0 0.5rem 0;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .role-badge {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .edit-profile-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: var(--primary);
          font-size: 1.25rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .edit-profile-btn:hover {
          color: #1e40af;
        }
        .profile-settings-list {
          margin-top: 2rem;
        }
        .settings-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border);
        }
        .settings-item:last-child {
          border-bottom: none;
        }
        .settings-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: var(--text-main);
        }
        .settings-info p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .danger-btn-pro {
          background: white;
          color: #ef4444;
          border: 1px solid #ef4444;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .danger-btn-pro:hover {
          background: #fef2f2;
        }
        `
            }} />
        </div>
    );
}
