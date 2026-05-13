import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useState } from 'react';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { createBooking } = useBooking();
    const [loading, setLoading] = useState(false);

    const items = location.state?.items || [];
    const totalToPay = location.state?.totalToPay || 0;

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleConfirm = async () => {
        try {
            setLoading(true);
            for (const item of items) {
                const selectedMachines = item.selectedMachines || [];
                for (const machine of selectedMachines) {
                    const bookingPayload = {
                        userId: Number(localStorage.getItem('userId')) || 1,
                        laundryId: Number(item.branch?.laundryId || item.branch?.id),
                        machineId: Number(machine.machineId || machine.id),
                        programId: Number(item.clothType?.programId),
                        programPrice: Number(item.clothType?.programPrice || item.clothType?.price || item.totalPrice || 0),
                        durationTime: Number(item.clothType?.durationMinutes || item.clothType?.durationTime || item.clothType?.duration || 45),
                        bookingDate: new Date(item.date).toISOString(),
                        bookingTime: item.timeSlots?.map(slot => slot.time).join(', ') || '10:00 AM',
                        detergent: item.detergent?.name || 'Standard',
                        bookingStatus: 'Pending',
                        isCompleted: false
                    };

                    const response = await fetch('https://localhost:7208/api/booking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bookingPayload)
                    });

                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(error || 'Booking Failed');
                    }
                }
            }

            createBooking(items);
            navigate('/booking-confirmation', { state: { bookings: items, total: totalToPay } });
        } catch (error) {
            console.error('BOOKING ERROR:', error);
            alert(`Booking Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-in" style={{ maxWidth: '1100px', margin: 'auto', padding: '3rem 1rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Finalize Your Booking</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Please review your order details before confirming your reservation.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
                {/* Left Side: Order Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '10px' }}>📋</span> 
                        Order Items ({items.length})
                    </h2>
                    
                    {items.map((item, index) => (
                        <div key={index} className="card" style={{ 
                            padding: '1.5rem', 
                            borderRadius: '20px', 
                            border: '1px solid var(--border)',
                            background: 'var(--bg-white)',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{item.branch?.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>{item.branch?.location || 'Main Branch'}</p>
                                </div>
                                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>PKR {item.totalPrice}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Service</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{item.clothType?.programName}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Detergent</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{item.detergent?.name || 'Standard'}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Date</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{item.date}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Time Slot</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{item.timeSlots?.map(s => s.time).join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side: Payment Summary */}
                <aside style={{ position: 'sticky', top: '100px' }}>
                    <div className="card" style={{ 
                        padding: '2.5rem', 
                        borderRadius: '24px', 
                        background: 'linear-gradient(135deg, #ffffff 0%, var(--bg-light) 100%)',
                        border: '1px solid var(--primary-light)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Summary</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <span style={{ fontWeight: '700' }}>PKR {totalToPay}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Service Fee</span>
                                <span style={{ fontWeight: '700', color: 'var(--success)' }}>FREE</span>
                            </div>
                            
                            <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Total Amount</span>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tax included</p>
                                </div>
                                <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.03em' }}>PKR {totalToPay}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'var(--primary-light)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                                Your booking is protected. Pay at the counter when you arrive.
                            </p>
                        </div>

                        <button 
                            className="btn btn-primary" 
                            onClick={handleConfirm}
                            disabled={loading}
                            style={{ 
                                marginTop: '2rem', 
                                width: '100%', 
                                padding: '1.25rem', 
                                fontSize: '1.1rem', 
                                borderRadius: '16px',
                                background: 'var(--primary)',
                                boxShadow: '0 8px 20px -6px var(--primary)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    Processing...
                                </>
                            ) : (
                                <>Confirm & Pay Now 🚀</>
                            )}
                        </button>
                        
                        <button 
                            className="btn btn-outline" 
                            onClick={() => navigate('/cart')}
                            style={{ width: '100%', marginTop: '1rem', border: 'none' }}
                        >
                            ← Back to Basket
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            By confirming, you agree to our <strong>Terms of Service</strong>
                        </p>
                    </div>
                </aside>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 992px) {
                    div[style*="grid-template-columns: 1fr 400px"] {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        position: static !important;
                        margin-top: 3rem;
                    }
                }
            `}</style>
        </div>
    );
}