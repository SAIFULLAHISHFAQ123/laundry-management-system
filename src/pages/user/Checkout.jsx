import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { createBooking } = useBooking();
    
    // Fallback in case user navigates directly
    const items = location.state?.items || [];
    const totalToPay = location.state?.totalToPay || 0;

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleConfirm = () => {
        // Create actual reservations from cart items
        createBooking(items);
        navigate('/booking-confirmation', { state: { bookings: items, total: totalToPay } });
    };

    return (
        <div className="container animate-in" style={{ maxWidth: '800px', margin: 'auto' }}>
            <h1 className="text-center mb-8" style={{ color: 'var(--primary)' }}>Checkout Security</h1>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Order Summary */}
                <div className="card">
                    <h3 className="mb-4">Order Summary ({items.length} Items)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--bg-light)' }}>
                                <div>
                                    <strong style={{ display: 'block' }}>{item.branch?.name}</strong>
                                    <small className="text-muted">{item.machineType} • {item.date} @ {item.timeSlots?.map(s => s.time).join(', ')}</small>
                                    {item.isQueued && <div style={{ color: 'var(--danger)', fontSize: '0.7rem', fontWeight: 'bold' }}>DISTANCE QUEUE ACTIVE</div>}
                                </div>
                                <strong>PKR {item.totalPrice}</strong>
                            </div>
                        ))}
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--primary-light)' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Payable</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>PKR {totalToPay}</span>
                        </div>
                    </div>
                </div>

                {/* Account / Contact Info */}
                <div className="card">
                    <h3 className="mb-4">Contact Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Customer Name</label>
                            <input className="input-control" type="text" defaultValue="Standard User" readOnly />
                        </div>
                        <div>
                            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
                            <input className="input-control" type="text" defaultValue="+92 300 1234567" readOnly />
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ⚠️ These details are retrieved from your profile. Please ensure they are correct for pickup notifications.
                    </p>
                </div>

                {/* Payment Method */}
                <div className="card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--primary-light)' }}>
                    <h3 className="mb-4" style={{ color: 'var(--primary-dark)' }}>Payment Method</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2.5rem' }}>💵</div>
                        <div>
                            <strong>Cash on Arrival</strong>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                                Pay at the laundry counter when you arrive for your slot.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/cart')}>Back to Cart</button>
                    <button className="btn btn-primary" style={{ flex: 2, padding: '1rem' }} onClick={handleConfirm}>Confirm Booking →</button>
                </div>
            </div>
        </div>
    );
}
