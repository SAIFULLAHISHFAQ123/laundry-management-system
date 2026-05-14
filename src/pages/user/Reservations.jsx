import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function Reservations() {
    const navigate = useNavigate();
    const { cancelBooking, addRating } = useBooking();

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [currentRating, setCurrentRating] = useState({ bookingId: '', laundryName: '', rating: 5, comment: '' });

    const [bookings, setBookings] = useState([]);
    const [laundries, setLaundries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthsFilter, setMonthsFilter] = useState('');
    const [laundryFilter, setLaundryFilter] = useState('');

    // User Profile state
    const [user, setUser] = useState({ id: null, fullName: 'User' });

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchProfile();
        fetchLaundries();
    }, []);

    // Fetch history when user ID is loaded or filters change
    useEffect(() => {
        if (user.id) {
            fetchHistory();
        }
    }, [monthsFilter, laundryFilter, user.id]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Handle hardcoded token gracefully
            if (token === 'hardcoded-user-token' || token === 'hardcoded-admin-token') {
                setUser({ id: 1, fullName: localStorage.getItem('user_name') || 'Guest User' });
                return;
            }

            const res = await fetch('https://localhost:7208/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 401) {
                localStorage.clear();
                window.location.href = '/';
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setUser({ id: data.id, fullName: data.fullName });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const fetchLaundries = async () => {
        try {
            const res = await fetch('https://localhost:7208/api/laundry');
            if (res.ok) {
                const data = await res.json();
                setLaundries(data);
            }
        } catch (error) {
            console.error("Failed to fetch laundries", error);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Updated endpoint to use the database API
            let url = `https://localhost:7208/api/Booking/UserHistory/${user.id}`;
            const params = new URLSearchParams();
            if (monthsFilter) params.append('months', monthsFilter);
            if (laundryFilter) params.append('laundryId', laundryFilter);

            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Failed to fetch booking history", error);
        } finally {
            setLoading(false);
        }
    };

    // Improved Filtering: Compare using Date objects for accuracy
    const upcoming = (bookings || []).filter(r =>
        (r.bookingStatus === 'Upcoming' || r.bookingStatus === 'Pending') &&
        new Date(r.bookingDate) >= new Date(today)
    );

    const past = (bookings || []).filter(r =>
        r.bookingStatus === 'Completed' ||
        r.bookingStatus === 'Cancelled' ||
        (new Date(r.bookingDate) < new Date(today))
    );

    const submitRating = () => {
        addRating({
            UserId: user?.id || 101, // fallback to avoid crash
            LaundryId: currentRating.laundryId || 1, // Need integer LaundryId
            BookingId: parseInt(currentRating.bookingId) || null,
            Stars: currentRating.rating,
            Comment: currentRating.comment
        });
        setShowRatingModal(false);
        alert('Thank you for your feedback!');
    };

    return (
        <div className="container animate-in" style={{ maxWidth: '1000px', margin: 'auto', padding: '2rem 1rem' }}>
            {/* Rating Modal */}
            {showRatingModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '450px', padding: '2.5rem', borderRadius: '24px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Rate Service</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>How was your experience at <strong>{currentRating.laundryName}</strong>?</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '2.5rem', marginBottom: '2rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                    key={star} 
                                    onClick={() => setCurrentRating({ ...currentRating, rating: star })}
                                    style={{ cursor: 'pointer', color: star <= currentRating.rating ? '#fbbf24' : '#e5e7eb' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <textarea 
                            className="input-control" 
                            placeholder="Add a comment (optional)..."
                            value={currentRating.comment}
                            onChange={(e) => setCurrentRating({ ...currentRating, comment: e.target.value })}
                            style={{ height: '100px', marginBottom: '2rem' }}
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowRatingModal(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitRating}>Submit Rating</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>
                        Welcome, {user.fullName.split(' ')[0]}!
                    </h1>
                    <p className="text-muted">Viewing your personalized booking history and activity from the database.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>New Booking</button>
            </div>

            {/* Filter Bar */}
            <div className="card mb-8" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', backgroundColor: 'var(--bg-light)', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>🕒 Time Range:</span>
                    <select
                        className="input-control"
                        style={{ width: '200px', padding: '0.5rem' }}
                        value={monthsFilter}
                        onChange={(e) => setMonthsFilter(e.target.value)}
                    >
                        <option value="">All Time</option>
                        <option value="1">This Month</option>
                        <option value="2">Last 2 Months</option>
                        <option value="12">Last 1 Year</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>🧺 Laundry:</span>
                    <select
                        className="input-control"
                        style={{ width: '250px', padding: '0.5rem' }}
                        value={laundryFilter}
                        onChange={(e) => setLaundryFilter(e.target.value)}
                    >
                        <option value="">All Branches</option>
                        {laundries.map(l => (
                            <option key={l.laundryId} value={l.laundryId}>{l.name}</option>
                        ))}
                    </select>
                </div>

                {(monthsFilter || laundryFilter) && (
                    <button
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginLeft: 'auto' }}
                        onClick={() => { setMonthsFilter(''); setLaundryFilter(''); }}
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center p-10">
                    <div className="animate-pulse">Loading bookings...</div>
                </div>
            ) : (
                <>
                    {/* Upcoming Section */}
                    <section style={{ marginBottom: '4rem' }}>
                        <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></span>
                            Upcoming Slots
                        </h3>

                        {upcoming.length === 0 ? (
                            <div className="card text-center text-muted" style={{ padding: '4rem 2rem' }}>
                                <p style={{ fontSize: '1.1rem' }}>No upcoming reservations. Time to do some laundry! 🧺</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }}>
                                {upcoming.map((res) => (
                                    <div key={res.bookingId} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'transform 0.2s', cursor: 'default' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: '800' }}>{res.laundry?.name || 'Laundry Branch'}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    Booking ID: <strong style={{ color: 'var(--text-main)' }}>#{res.bookingId}</strong>
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-block', padding: '0.4rem 1rem' }}>Upcoming</span>
                                                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>PKR {res.programPrice}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-light)', borderRadius: '12px' }}>
                                            <div>
                                                <small className="text-muted" style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.4rem' }}>Time & Date</small>
                                                <strong style={{ display: 'block' }}>{res.bookingDate}</strong>
                                                <strong style={{ color: 'var(--primary)' }}>{res.bookingTime}</strong>
                                            </div>
                                            <div>
                                                <small className="text-muted" style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.4rem' }}>Machine & Program</small>
                                                <strong>{res.machine?.machineName || 'Machine'}</strong><br />
                                                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                                                    {res.program?.programName || 'Standard Wash'}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ flex: 1, borderColor: '#fee2e2', color: '#ef4444', backgroundColor: '#fef2f2' }}
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                                                        const success = await cancelBooking(res.bookingId);
                                                        if (success) {
                                                            fetchHistory(); // Refresh from DB
                                                        }
                                                    }
                                                }}
                                            >
                                                Cancel Booking
                                            </button>
                                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/notifications')}>Get Directions</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* History Section */}
                    <section>
                        <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></span>
                            Past History
                        </h3>

                        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: 'var(--bg-light)', textAlign: 'left' }}>
                                    <tr>
                                        <th style={{ padding: '1.25rem' }}>Branch</th>
                                        <th style={{ padding: '1.25rem' }}>Date & Time</th>
                                        <th style={{ padding: '1.25rem' }}>Service</th>
                                        <th style={{ padding: '1.25rem' }}>Status</th>
                                        <th style={{ padding: '1.25rem', textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {past.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
                                                No past activity recorded for the selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        past.map((res) => (
                                            <tr key={res.bookingId} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <strong style={{ color: 'var(--text-main)' }}>{res.laundry?.name}</strong>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{res.bookingId}</div>
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <div>{res.bookingDate}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.bookingTime}</div>
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <div style={{ fontWeight: '600' }}>{res.machine?.machineName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{res.program?.programName}</div>
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <span className={`badge ${res.bookingStatus === 'Completed' ? 'badge-primary' : 'badge-danger'}`} style={{ padding: '0.3rem 0.8rem' }}>
                                                        {res.bookingStatus}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                                    <strong style={{ fontSize: '1.1rem' }}>PKR {res.programPrice}</strong>
                                                    {res.bookingStatus === 'Completed' && (
                                                        <button 
                                                            className="btn btn-outline" 
                                                            style={{ display: 'block', fontSize: '0.7rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem', marginLeft: 'auto' }}
                                                            onClick={() => {
                                                                setCurrentRating({ bookingId: res.bookingId, laundryId: res.laundryId, laundryName: res.laundry?.name || 'Laundry', rating: 5, comment: '' });
                                                                setShowRatingModal(true);
                                                            }}
                                                        >
                                                            Rate Service
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
