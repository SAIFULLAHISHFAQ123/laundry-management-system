import { useState, useEffect } from 'react';

export default function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('laundry_reservations') || '[]');
        setBookings(stored.reverse()); 
    }, []);

    const handleChangeStatus = (id, newStatus) => {
        const stored = JSON.parse(localStorage.getItem('laundry_reservations') || '[]');
        const updated = stored.map(b => b.bookingId === id ? { ...b, status: newStatus } : b);
        localStorage.setItem('laundry_reservations', JSON.stringify(updated));
        setBookings([...updated].reverse());

        // Also update individual user notifications if it were a real system
        // ... handled by simulation for now
    };

    const filtered = bookings.filter(b => {
        const matchesSearch = b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              b.branch?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: bookings.length,
        active: bookings.filter(b => b.status === 'Upcoming').length,
        completed: bookings.filter(b => b.status === 'Completed').length,
    };

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto' }}>
            {/* Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card text-center">
                    <h4 className="text-muted mb-2">Total Orders</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.total}</div>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--success)' }}>
                    <h4 className="text-muted mb-2">Pending/Upcoming</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{stats.active}</div>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
                    <h4 className="text-muted mb-2">Completed</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.completed}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="card" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                        type="text" 
                        className="input-control" 
                        placeholder="Search by ID or Branch..." 
                        style={{ margin: 0 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <select className="input-control" style={{ margin: 0 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'white', borderBottom: '2px solid var(--border)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem' }}>Order Info</th>
                            <th style={{ padding: '1.25rem' }}>Schedule</th>
                            <th style={{ padding: '1.25rem' }}>Unit Detail</th>
                            <th style={{ padding: '1.25rem' }}>Status</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-12 text-muted">No reservations found.</td></tr>
                        ) : (
                            filtered.map((b) => (
                                <tr key={b.bookingId} style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <strong style={{ display: 'block' }}>#{b.bookingId}</strong>
                                        <small className="text-muted">Customer Order • PKR {b.totalPrice}</small>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{b.date}</div>
                                        <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{b.timeSlot?.time}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{b.branch?.name}</div>
                                        <small className="text-muted">{b.machineType} ({b.machine?.id})</small>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span className={`badge ${b.status === 'Upcoming' ? 'badge-success' : b.status === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        {b.status === 'Upcoming' && (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button 
                                                    className="btn btn-primary" 
                                                    style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                                    onClick={() => handleChangeStatus(b.bookingId, 'Completed')}
                                                >
                                                    Mark Completed
                                                </button>
                                                <button 
                                                    className="btn btn-outline" 
                                                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                                    onClick={() => handleChangeStatus(b.bookingId, 'Cancelled')}
                                                >
                                                    Void
                                                </button>
                                            </div>
                                        )}
                                        {b.status !== 'Upcoming' && <span className="text-muted" style={{ fontSize: '0.85rem' }}>Archived</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
