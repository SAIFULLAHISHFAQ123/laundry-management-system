import { useState, useEffect } from 'react';
import { getBranches } from '../../services/MapService';
import '../../styles/admin.css';

export default function BranchOverview() {
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        setBranches(getBranches());
    }, []);

    const toggleBranchStatus = (id) => {
        const updated = branches.map(b => {
            if (b.id === id) {
                const nextStatus = b.status === "Green" ? "Red" : "Green";
                return { ...b, status: nextStatus };
            }
            return b;
        });
        setBranches(updated);
        localStorage.setItem('laundry_branches', JSON.stringify(updated));
    };

    return (
        <div className="admin-container">
            {/* Stats Summary Bar */}
            <div className="stats-grid">
                <div className="stat-card" style={{ borderLeft: '5px solid var(--primary)', borderTop: 'none' }}>
                    <div className="stat-label">Total Branches</div>
                    <div className="stat-value">{branches.length}</div>
                </div>
                <div className="stat-card" style={{ borderLeft: '5px solid #10b981', borderTop: 'none' }}>
                    <div className="stat-label">Online Now</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>{branches.filter(b => b.status === 'Green').length}</div>
                </div>
                <div className="stat-card" style={{ borderLeft: '5px solid #ef4444', borderTop: 'none' }}>
                    <div className="stat-label">Peak Capacity</div>
                    <div className="stat-value" style={{ color: '#ef4444' }}>{branches.filter(b => b.status === 'Red').length}</div>
                </div>
                <div className="stat-card" style={{ borderLeft: '5px solid #f59e0b', borderTop: 'none' }}>
                    <div className="stat-label">Avg Satisfaction</div>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>4.9<span style={{ fontSize: '1rem', marginLeft: '4px' }}>★</span></div>
                </div>
            </div>

            <div className="admin-table-container animate-in">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Branch Details</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>Inventory</th>
                            <th>Status</th>
                            <th>Pricing</th>
                            <th style={{ textAlign: 'right' }}>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map((b) => (
                            <tr key={b.id}>
                                <td>
                                    <strong style={{ display: 'block' }}>{b.name}</strong>
                                    <small className="text-muted">⭐ {b.rating} Rating</small>
                                </td>
                                <td style={{ fontSize: '0.85rem' }}>{b.contact || '+92 3XX XXXXXXX'}</td>
                                <td>{b.city}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span className="badge badge-primary">{b.machines.available.washer + b.machines.busy.washer}W</span>
                                        <span className="badge badge-primary" style={{ backgroundColor: '#6366f1' }}>{b.machines.available.dryer + b.machines.busy.dryer}D</span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '4px 12px',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        backgroundColor: b.status === "Green" ? "#dcfce7" : b.status === "Orange" ? "#fef3c7" : "#fee2e2",
                                        color: b.status === "Green" ? "#15803d" : b.status === "Orange" ? "#92400e" : "#b91c1c"
                                    }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: b.status === "Green" ? "#15803d" : b.status === "Orange" ? "#92400e" : "#b91c1c" }}></span>
                                        {b.status === "Green" ? 'AVAILABLE' : b.status === "Orange" ? 'BUSY SOON' : 'FULL'}
                                    </span>
                                </td>
                                <td>
                                    <strong>PKR {b.basePrice}</strong>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                            onClick={() => toggleBranchStatus(b.id)}
                                        >
                                            Toggle
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                            onClick={() => alert(`Editing ${b.name}...`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Only green branches are fully bookable by customers in Real-Time availability searches.</p>
            </div>
        </div>
    );
}
