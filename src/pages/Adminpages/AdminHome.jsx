import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStore, FaTshirt, FaFlask, FaMoneyBill, FaUserShield, FaPlus } from "react-icons/fa";

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    machines: 0,
    bookings: 0,
    laundries: 0,
  });

  useEffect(() => {
    setStats({
      users: 120,
      machines: 35,
      bookings: 210,
      laundries: 12,
    });
  }, []);

  return (
    <div className="admin-screen screen">
      <div className="process-header">
        <div className="header-info">
          <h2>Admin Dashboard</h2>
          <p className="subtitle">Welcome back 👋 Manage your Laundry System here.</p>
        </div>
      </div>

      <div className="flow-container">
        <div className="admin-stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{stats.users}</p>
          </div>
          <div className="stat-card">
            <h4>Total Machines</h4>
            <p>{stats.machines}</p>
          </div>
          <div className="stat-card">
            <h4>Total Bookings</h4>
            <p>{stats.bookings}</p>
          </div>
          <div className="stat-card">
            <h4>Laundry Shops</h4>
            <p>{stats.laundries}</p>
          </div>
        </div>

        <h3 className="section-title" style={{ marginTop: '2rem' }}>Quick Actions</h3>
        <div className="admin-actions-grid">
          <button className="admin-action-btn" onClick={() => navigate('/admin/add-branch')}>
            <div className="icon-wrapper"><FaStore /></div>
            <span>Add Branch</span>
          </button>

          <button className="admin-action-btn" onClick={() => navigate('/admin/add-machine')}>
            <div className="icon-wrapper"><FaTshirt /></div>
            <span>Add Machine</span>
          </button>

          <button className="admin-action-btn" onClick={() => navigate('/admin/add-detergent')}>
            <div className="icon-wrapper"><FaFlask /></div>
            <span>Add Detergent</span>
          </button>

          <button className="admin-action-btn" onClick={() => navigate('/admin/update-price')}>
            <div className="icon-wrapper"><FaMoneyBill /></div>
            <span>Update Prices</span>
          </button>

          <button className="admin-action-btn" onClick={() => navigate('/admin/profile')}>
            <div className="icon-wrapper"><FaUserShield /></div>
            <span>Admin Profile</span>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .admin-screen {
          background: var(--bg-color);
          min-height: 100vh;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border);
        }
        .stat-card h4 {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .stat-card p {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
        }
        .admin-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
        }
        .admin-action-btn {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-main);
          font-weight: 600;
        }
        .admin-action-btn:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .icon-wrapper {
          background: #eff6ff;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--primary);
          font-size: 1.25rem;
        }
        `
      }} />
    </div>
  );
}
