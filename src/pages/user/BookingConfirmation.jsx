import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { bookings, total } = location.state || { bookings: [], total: 0 };

    if (bookings.length === 0) {
        navigate('/home');
        return null;
    }

    return (
        <div className="container animate-in" style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', paddingTop: '2rem' }}>
            <div className="card" style={{ padding: '3rem 2rem' }}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: 'var(--success)', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '3rem', 
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 0 10px rgba(16, 185, 129, 0.1)'
                }}>
                    ✓
                </div>
                
                <h1 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
                <p className="text-muted mb-8">Your laundry slots have been reserved successfully.</p>
                
                <div style={{ backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Booking Details</h4>
                    
                    {bookings.map((b, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <strong style={{ color: 'var(--primary)' }}>ID: {b.bookingId || b.id.toString().slice(-6)}</strong>
                                <span className="badge badge-primary">Queue: #{b.queuePosition || 1}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                📍 {b.branch?.name}<br/>
                                📅 {b.date} @ {b.timeSlots?.map(s => s.time).join(', ')}<br/>
                                🧺 {b.machineType} ({b.machine?.id})
                                {b.isQueued && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '4px', color: '#991b1b', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        ⚠️ DISTANCE QUEUE: Arrive within {b.estimatedArrival + 5} mins!
                                    </div>
                                )}
                            </p>
                        </div>
                    ))}
                    
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Total Amount Paid</strong>
                        <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>PKR {total}</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/reservations')}>View My Reservations</button>
                    <button className="btn btn-outline" onClick={() => navigate('/home')}>Return to Home</button>
                </div>
                
                <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Please arrive 5 minutes before your slot time. Show your Booking ID at the counter for pickup/dropoff.
                </p>
            </div>
        </div>
    );
}
