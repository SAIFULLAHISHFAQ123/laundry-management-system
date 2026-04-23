import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function Reservations() {
    const navigate = useNavigate();
    const { reservations, cancelBooking } = useBooking();

    const upcoming = (reservations || []).filter(r => r.status === 'Upcoming');
    const past = (reservations || []).filter(r => r.status !== 'Upcoming');

    return (
        <div className="container animate-in" style={{ maxWidth: '900px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', margin: 0 }}>My Reservations</h1>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>New Booking</button>
            </div>

            {/* Upcoming Section */}
            <section style={{ marginBottom: '3rem' }}>
                <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                    Upcoming Slots
                </h3>

                {upcoming.length === 0 ? (
                    <div className="card text-center text-muted" style={{ padding: '3rem' }}>
                        <p>No upcoming reservations. Time to do some laundry! 🧺</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
                        {upcoming.map((res) => (
                            <div key={res.bookingId} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary)' }}>{res.branch?.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            ID: <strong>{res.bookingId}</strong>
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="badge badge-success" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>Upcoming</span>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>PKR {res.totalPrice}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px' }}>
                                    <div>
                                        <small className="text-muted" style={{ display: 'block', textTransform: 'uppercase' }}>Time & Date</small>
                                        <strong>{res.date}</strong><br/>
                                        <strong>{res.timeSlots?.map(s => s.time).join(', ')}</strong>
                                    </div>
                                    <div>
                                        <small className="text-muted" style={{ display: 'block', textTransform: 'uppercase' }}>Machine & Queue</small>
                                        <strong>{res.machineType} ({res.machine?.id})</strong><br/>
                                        <span style={{ color: res.isQueued ? 'var(--danger)' : 'var(--primary)', fontWeight: 'bold' }}>
                                            {res.isQueued ? `Distance Queue: Arrive in ${res.estimatedArrival}m` : `#${res.queuePosition} in Queue`}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button 
                                        className="btn btn-outline" 
                                        style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                                                cancelBooking(res.bookingId);
                                            }
                                        }}
                                    >
                                        Cancel Booking
                                    </button>
                                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/notifications')}>Get Directions</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* History Section */}
            <section>
                <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></span>
                    Past History
                </h3>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: 'var(--bg-light)', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Branch</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Unit</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {past.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No past activity recorded.</td>
                                </tr>
                            ) : (
                                past.map((res) => (
                                    <tr key={res.bookingId} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}><strong>{res.branch?.name}</strong></td>
                                        <td style={{ padding: '1rem' }}>{res.date}</td>
                                        <td style={{ padding: '1rem' }}>{res.machineType} ({res.machine?.id})</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`badge ${res.status === 'Completed' ? 'badge-primary' : 'badge-danger'}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}><strong>PKR {res.totalPrice}</strong></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
