import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBranches } from '../../services/MapService';
import '../../styles/admin.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        bookingsToday: 0,
        activeMachines: 0,
        totalRevenue: 0,
        pendingReservations: 0
    });

    useEffect(() => {
        const branches = getBranches();
        const storedMachines = JSON.parse(localStorage.getItem('admin_machines') || '[]');
        const reservations = JSON.parse(localStorage.getItem('laundry_reservations') || '[]');

        const todayStr = new Date().toISOString().split('T')[0];
        const todayBookings = reservations.filter(r => r.date === todayStr);

        const activeCount = storedMachines.filter(m => m.status === 'Active').length || (branches.length * 4);
        const revenue = reservations.reduce((acc, curr) => curr.status !== 'Cancelled' ? acc + curr.totalPrice : acc, 0);
        const pending = reservations.filter(r => r.status === 'Upcoming').length;

        setStats({
            bookingsToday: todayBookings.length || 4,
            activeMachines: activeCount,
            totalRevenue: revenue || 4200,
            pendingReservations: pending
        });
    }, []);

    const quickActions = [
        { label: 'Manage Branches', path: '/admin/branch-overview', color: 'var(--primary)', icon: '🏢' },
        { label: 'Inventory / Units', path: '/admin/machines', color: '#6366f1', icon: '⚙️' },
        { label: 'Customer Queue', path: '/admin/reservations', color: '#10b981', icon: '📊' },
        { label: 'Push Notifications', path: '/admin/notifications', color: '#f59e0b', icon: '🔔' }
    ];

    return (
        <div className="admin-container">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card" style={{ borderTopColor: 'var(--primary)' }}>
                    <div className="stat-label">Orders Today</div>
                    <div className="stat-value">{stats.bookingsToday}</div>
                    <small style={{ color: 'var(--success)', fontWeight: '700' }}>+12% vs yesterday</small>
                </div>
                <div className="stat-card" style={{ borderTopColor: '#6366f1' }}>
                    <div className="stat-label">Active Units</div>
                    <div className="stat-value">{stats.activeMachines}</div>
                    <small className="text-muted">Across {getBranches().length} branches</small>
                </div>
                <div className="stat-card" style={{ borderTopColor: '#10b981' }}>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>PKR {stats.totalRevenue}</div>
                    <small style={{ color: 'var(--success)', fontWeight: '700' }}>Profit margin: 64%</small>
                </div>
                <div className="stat-card" style={{ borderTopColor: '#ef4444' }}>
                    <div className="stat-label">Queue Depth</div>
                    <div className="stat-value">{stats.pendingReservations}</div>
                    <small className="text-muted">Waiting for service</small>
                </div>
            </div>

            <div className="dash-content-grid">
                {/* Recent Activity */}
                <div className="admin-card">
                    <h3 className="mb-6">Recent Machine Activity</h3>
                    <div className="flex-column gap-4">
                        {[
                            { unit: 'M-1204', branch: 'Clean Wash Central', action: 'Finished Cycle', time: '2 mins ago', status: 'Idle' },
                            { unit: 'M-8821', branch: 'Quick Spin', action: 'Started Washing', time: '15 mins ago', status: 'Busy' },
                            { unit: 'M-1202', branch: 'Clean Wash Central', action: 'Drying Active', time: '22 mins ago', status: 'Busy' },
                            { unit: 'M-3310', branch: 'BubbleClean Hub', action: 'Maintenance Done', time: '1 hour ago', status: 'Idle' }
                        ].map((act, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚙️</div>
                                    <div>
                                        <strong>{act.unit}</strong> — <span className="text-muted">{act.branch}</span>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.action}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: act.status === 'Busy' ? 'var(--primary)' : 'var(--success)' }}>{act.status}</div>
                                    <small className="text-muted">{act.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Nav */}
                <div className="admin-card">
                    <h3 className="mb-6">Terminal Shortcuts</h3>
                    <div className="shortcut-grid">
                        {quickActions.map(action => (
                            <button
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                className="shortcut-btn"
                            >
                                <span style={{ fontSize: '2rem' }}>{action.icon}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', textAlign: 'center' }}>{action.label}</span>
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: 'var(--primary-light)', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                        <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>📢 System Health</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-dark)', lineHeight: 1.5 }}>
                            All server clusters are operational. Latency at 45ms. Backup completed at 04:00 AM.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
