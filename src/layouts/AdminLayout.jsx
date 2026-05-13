import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../styles/admin.css';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/branch-overview', label: 'Laundries', icon: '🏢' },
        { path: '/admin/machines', label: 'Machines', icon: '⚙️' },
        { path: '/admin/bookings', label: 'Live Bookings', icon: '🕒' },
        { path: '/admin/machine-programs', label: 'Programs', icon: '🧬' },
        { path: '/admin/users', label: 'Manage Users', icon: '👥' },
        { path: '/admin/reservations', label: 'Analytics', icon: '📈' },
        { path: '/admin/notifications', label: 'Alerts', icon: '🔔' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const currentPage = navItems.find(n => n.path === location.pathname)?.label || 'Admin';

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <div className="mobile-only" style={{ 
                display: 'none', 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '60px', 
                backgroundColor: 'white', 
                zIndex: 1001, 
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
                padding: '0 1rem',
                justifyContent: 'space-between'
            }}>
                <div className="flex-center gap-2">
                    <div className="brand-icon" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>L</div>
                    <span style={{ fontWeight: '800', color: 'var(--primary)' }}>LaundryX</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{
                display: 'flex',
                ...(isMobileMenuOpen && { transform: 'translateX(0)', width: '280px' })
            }}>
                <div className="admin-logo-section">
                    <div className="brand-icon">L</div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>Admin Portal</h2>
                </div>

                <nav className="admin-nav">
                    <div className="admin-nav-label">Main Menu</div>
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path} 
                            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px', marginBottom: '1rem' }}>
                        <div style={{ width: '35px', height: '35px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>System Admin</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Superuser</div>
                        </div>
                    </div>
                    <button 
                        className="btn btn-danger w-full" 
                        onClick={handleLogout}
                    >
                        🔒 <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="animate-in">
                        <h1 className="admin-page-title">{currentPage}</h1>
                        <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Welcome back, administrator.</p>
                    </div>
                    
                    <div className="flex gap-2 desktop-only">
                        <button className="btn btn-outline" onClick={() => navigate('/admin/add-laundry')}>+ Branch</button>
                        <button className="btn btn-outline" onClick={() => navigate('/admin/add-machine-program')}>+ Program</button>
                        <button className="btn btn-primary" onClick={() => navigate('/admin/add-machine')}>+ Machine</button>
                    </div>
                </header>

                <div className="animate-in" style={{ flex: 1 }}>
                    <Outlet />
                </div>

                <footer style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span>&copy; 2026 LaundryX Console</span>
                    <span className="flex-center gap-2">
                        Status: <span className="badge badge-success" style={{ padding: '2px 8px' }}>Online</span>
                    </span>
                </footer>
            </main>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-only { display: flex !important; }
                    .admin-sidebar { 
                        transform: translateX(-100%); 
                        width: 280px;
                        transition: transform 0.3s ease;
                        box-shadow: 10px 0 30px rgba(0,0,0,0.1);
                    }
                    .admin-sidebar.mobile-open { transform: translateX(0); }
                    .admin-main { margin-left: 0; padding-top: 80px; }
                    .desktop-only { display: none !important; }
                    .admin-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
}
