import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../styles/admin.css';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/admin/branch-overview', label: 'Laundries', icon: '🏢' },
        { path: '/admin/machines', label: 'Machines', icon: '⚙️' },
        { path: '/admin/bookings', label: 'Live Bookings', icon: '🕒' },
        { path: '/admin/reservations', label: 'Queue Analytics', icon: '📊' },
        { path: '/admin/notifications', label: 'Push Alerts', icon: '🔔' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const currentPage = navItems.find(n => n.path === location.pathname)?.label || 'Dashboard';

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo-section">
                    <div className="brand-icon">L</div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>Admin Portal</h2>
                </div>

                <nav className="admin-nav">
                    <div className="admin-nav-label">Menu</div>
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path} 
                            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px', marginBottom: '1rem' }}>
                        <div style={{ width: '35px', height: '35px', backgroundColor: '#64748b', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
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
                    <div>
                        <h1 className="admin-page-title">{currentPage}</h1>
                        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back, administrator.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" onClick={() => navigate('/admin/add-laundry')}>+ Branch</button>
                        <button className="btn btn-primary" onClick={() => navigate('/admin/add-machine')}>+ Machine</button>
                    </div>
                </header>

                <div className="animate-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
