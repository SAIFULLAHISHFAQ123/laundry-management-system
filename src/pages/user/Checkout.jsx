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
        <div className="container animate-in" style={{ maxWidth: '900px', margin: 'auto', padding: '2rem 1rem' }}>
            <div className="text-center mb-10">
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Secure Checkout</h1>
                <p className="text-muted">Review your final order details and confirm your reservation.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
                <div className="flex-column gap-6">
                    {/* Order Summary */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            🧾 Order Breakdown
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {items.map((item, idx) => (
                                <div key={idx} style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--bg-light)', lastChild: { borderBottom: 'none' } }}>
                                    <div className="flex-between mb-3">
                                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{item.branch?.name}</strong>
                                        <strong style={{ color: 'var(--primary)' }}>PKR {item.totalPrice}</strong>
                                    </div>
                                    <div className="grid-2" style={{ gap: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'block', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>Configuration</span>
                                            {item.machineQuantities 
                                                ? Object.entries(item.machineQuantities).filter(([_, q]) => q > 0).map(([cap, qty]) => `${qty}x ${cap}`).join(', ')
                                                : '1 Machine'} ({item.clothType?.programName || 'Wash'})
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'block', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>Schedule</span>
                                            {item.date} @ {item.timeSlots?.map(s => s.time).join(', ')}
                                        </div>
                                    </div>
                                    {item.isQueued && (
                                        <div style={{ 
                                            marginTop: '1rem', 
                                            padding: '0.5rem 1rem', 
                                            background: '#fef2f2', 
                                            borderRadius: '8px', 
                                            color: '#ef4444', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '800',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            🚀 HIGH PRIORITY QUEUE ACTIVE
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account / Contact Info */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Contact Information</h3>
                        <div className="grid-2" style={{ gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Verified Customer</label>
                                <input className="input-control" type="text" defaultValue={localStorage.getItem('user_name') || "Standard User"} readOnly style={{ background: 'var(--bg-light)', cursor: 'not-allowed' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Primary Phone</label>
                                <input className="input-control" type="text" defaultValue={localStorage.getItem('user_phone') || "+92 300 1234567"} readOnly style={{ background: 'var(--bg-light)', cursor: 'not-allowed' }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px' }}>
                            <span style={{ fontSize: '1.25rem' }}>💡</span>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: '600', lineHeight: 1.4 }}>
                                We'll use these details to send you pickup notifications and queue alerts.
                            </p>
                        </div>
                    </div>
                </div>

                <aside style={{ position: 'sticky', top: '100px' }}>
                    {/* Payment Card */}
                    <div className="card" style={{ padding: '2rem', border: '2px solid var(--primary)', background: 'linear-gradient(to bottom, #fff, var(--primary-light))' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Payment</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>💵</div>
                                <div>
                                    <strong style={{ fontSize: '1rem', display: 'block' }}>Cash on Arrival</strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pay at counter</span>
                                </div>
                            </div>
                            
                            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                <div className="flex-between mb-2">
                                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Total to Pay</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>PKR {totalToPay}</span>
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ padding: '1.1rem', fontSize: '1.1rem', borderRadius: '14px', width: '100%' }} onClick={handleConfirm}>
                                Confirm & Reserve →
                            </button>
                            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/cart')}>
                                Back to Basket
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    div[style*="grid-template-columns: 1fr 340px"] {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        position: static !important;
                        margin-top: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}

