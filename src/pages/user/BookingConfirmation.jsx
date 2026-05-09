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
        <div className="container animate-in" style={{ maxWidth: '800px', margin: 'auto', padding: '4rem 1rem', textAlign: 'center' }}>
            <div className="card" style={{ padding: '4rem 2rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15)' }}>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '4rem', 
                    margin: '0 auto 2rem',
                    boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
                    animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    ✓
                </div>
                
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Reservation Secured!</h1>
                <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>Your laundry slots have been successfully booked and verified.</p>
                
                <div style={{ backgroundColor: 'var(--bg-light)', borderRadius: '24px', padding: '2.5rem', marginBottom: '3rem', textAlign: 'left', border: '1px solid var(--border)' }}>
                    <div className="flex-between mb-6" style={{ borderBottom: '2px dashed var(--border)', paddingBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Booking Receipt</h4>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex-column gap-6">
                        {bookings.map((b, idx) => (
                            <div key={idx} style={{ paddingBottom: idx !== bookings.length - 1 ? '1.5rem' : 0, borderBottom: idx !== bookings.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                                <div className="flex-between mb-3">
                                    <div>
                                        <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'block' }}>ID: #{b.bookingId || b.id?.toString().slice(-6) || 'N/A'}</strong>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{b.branch?.name}</span>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem 1rem' }}>Queue Pos: #{b.queuePosition || 1}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <div>
                                        <span style={{ display: 'block', fontWeight: '700', color: 'var(--text-main)' }}>Schedule</span>
                                        {b.date} @ {b.timeSlots?.map(s => s.time).join(', ')}
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontWeight: '700', color: 'var(--text-main)' }}>Equipment</span>
                                        {b.machineQuantities ? Object.entries(b.machineQuantities).filter(([_, q]) => q > 0).map(([cap, qty]) => `${qty}x ${cap}`).join(', ') : '1 Unit'}
                                    </div>
                                </div>
                                {b.isQueued && (
                                    <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.85rem' }}>
                                        <strong>🚀 Distance Queue Alert:</strong> Please arrive at the laundry within <strong>{b.estimatedArrival + 5} minutes</strong> to maintain your priority status.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Total Paid (COD)</span>
                        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>PKR {total}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <button className="btn btn-primary" style={{ padding: '1rem' }} onClick={() => navigate('/reservations')}>📜 View History</button>
                    <button className="btn btn-outline" style={{ padding: '1rem' }} onClick={() => navigate('/home')}>🏠 Back to Home</button>
                </div>
                
                <p style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    A confirmation email has been sent to your registered address.<br/>
                    Please present your Booking ID at the counter for service.
                </p>
            </div>
            <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

