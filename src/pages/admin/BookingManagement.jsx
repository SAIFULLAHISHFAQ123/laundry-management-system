import { useState, useEffect } from 'react';
import '../../styles/admin.css';
import { useBooking } from '../../context/BookingContext';

export default function BookingManagement() {
    const { triggerRatingPrompt } = useBooking();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch('https://localhost:7208/api/booking');
            if (res.ok) {
                const data = await res.json();
                setBookings(data.reverse()); 
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            // Fallback to local storage if API fails
            const stored = JSON.parse(localStorage.getItem('laundry_reservations') || '[]');
            setBookings(stored.reverse());
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (id, newStatus) => {
        try {
            // In a real API, this would be a PATCH or PUT request
            const res = await fetch(`https://localhost:7208/api/booking/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStatus)
            });

            if (res.ok) {
                const targetBooking = bookings.find(b => b.bookingId === id || b.id === id);
                if (newStatus === 'Completed' && targetBooking) {
                    const userId = targetBooking.userId || 101;
                    triggerRatingPrompt(id, targetBooking.laundryId || 1, userId, `User #${userId}`, 'Admin');
                }
                setBookings(bookings.map(b => (b.bookingId === id || b.id === id) ? { ...b, status: newStatus } : b));
            } else {
                // Local fallback update
                const stored = JSON.parse(localStorage.getItem('laundry_reservations') || '[]');
                const targetBooking = stored.find(b => b.bookingId === id || b.id === id);
                if (newStatus === 'Completed' && targetBooking) {
                    const userId = targetBooking.userId || 101;
                    triggerRatingPrompt(id, targetBooking.laundryId || 1, userId, `User #${userId}`, 'Admin');
                }
                const updated = stored.map(b => b.bookingId === id ? { ...b, status: newStatus } : b);
                localStorage.setItem('laundry_reservations', JSON.stringify(updated));
                setBookings([...updated].reverse());
            }
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order from the database?')) return;

        try {
            const res = await fetch(`https://localhost:7208/api/booking/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Order deleted successfully');
                setBookings(bookings.filter(b => b.bookingId !== id && b.id !== id));
                
                // Also update local storage
                const stored = JSON.parse(localStorage.getItem('laundry_reservations') || '[]');
                const updated = stored.filter(b => b.bookingId !== id && b.id !== id);
                localStorage.setItem('laundry_reservations', JSON.stringify(updated));
            } else {
                alert('Failed to delete order from database');
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert('Error connecting to database');
        }
    };

    const filtered = bookings.filter(b => {
        const idStr = String(b.bookingId || b.id || '');
        const branchName = b.branch?.name || b.laundry?.name || '';
        const matchesSearch = idStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              branchName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter || b.bookingStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: bookings.length,
        active: bookings.filter(b => (b.status || b.bookingStatus) === 'Upcoming' || (b.status || b.bookingStatus) === 'Pending').length,
        completed: bookings.filter(b => (b.status || b.bookingStatus) === 'Completed').length,
    };

    return (
        <div className="admin-container animate-in">
            <header className="flex-between mb-8">
                <div>
                    <h2 className="admin-page-title">Order Management</h2>
                    <p className="text-muted">Monitor and manage all laundry reservations across branches.</p>
                </div>
            </header>

            {/* Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="admin-card text-center">
                    <h4 className="text-muted mb-2">Total Orders</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.total}</div>
                </div>
                <div className="admin-card text-center" style={{ borderTop: '4px solid #10b981' }}>
                    <h4 className="text-muted mb-2">Active Orders</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{stats.active}</div>
                </div>
                <div className="admin-card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
                    <h4 className="text-muted mb-2">Completed</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.completed}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="admin-card mb-6" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
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
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem' }}>Order Info</th>
                            <th style={{ padding: '1.25rem' }}>Schedule</th>
                            <th style={{ padding: '1.25rem' }}>Unit Detail</th>
                            <th style={{ padding: '1.25rem' }}>Status</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-12 text-muted">Loading reservations...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-12 text-muted">No reservations found.</td></tr>
                        ) : (
                            filtered.map((b) => (
                                <tr key={b.bookingId || b.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <strong style={{ display: 'block' }}>#{b.bookingId || b.id}</strong>
                                        <small className="text-muted">PKR {b.totalPrice || b.programPrice}</small>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{b.date || b.bookingDate?.split('T')[0]}</div>
                                        <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{b.timeSlot?.time || b.bookingTime}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{b.branch?.name || b.laundry?.name || 'Branch'}</div>
                                        <small className="text-muted">Machine: {b.machineId}</small>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span className={`badge ${(b.status || b.bookingStatus) === 'Upcoming' || (b.status || b.bookingStatus) === 'Pending' ? 'badge-success' : (b.status || b.bookingStatus) === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                                            {b.status || b.bookingStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {(b.status || b.bookingStatus) === 'Upcoming' || (b.status || b.bookingStatus) === 'Pending' ? (
                                                <button 
                                                    className="btn btn-primary" 
                                                    style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                                    onClick={() => handleChangeStatus(b.bookingId || b.id, 'Completed')}
                                                >
                                                    Complete
                                                </button>
                                            ) : null}
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                                onClick={() => handleDeleteBooking(b.bookingId || b.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
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
