import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, resetBooking } = useBooking();
    
    const [selectedIds, setSelectedIds] = useState(cart.map(item => item.id));

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === cart.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cart.map(item => item.id));
        }
    };

    const selectedItems = cart.filter(item => selectedIds.includes(item.id));
    const totalToPay = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Please select at least one booking to checkout.");
            return;
        }
        navigate('/checkout', { state: { items: selectedItems, totalToPay } });
    };

    const handleAddAnother = () => {
        resetBooking();
        navigate('/home');
    };

    if (cart.length === 0) {
        return (
            <div className="container animate-in">
                <div className="empty-state-container card">
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
                    <h2 className="mb-4">Your basket is empty</h2>
                    <p className="text-muted mb-8">You haven't added any laundry bookings yet. Let's find a nearby laundry to get started!</p>
                    <button className="btn btn-primary" onClick={() => navigate('/home')}>Explore Map</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-in" style={{ maxWidth: '1200px', margin: 'auto', padding: '2rem 1rem' }}>
            <header className="mb-10">
                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Laundry Basket</h1>
                        <p className="text-muted">Review your selected slots before proceeding to payment.</p>
                    </div>
                    <button className="btn btn-outline" onClick={handleAddAnother} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                        ✨ Add Another Booking
                    </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: '16px' }}>
                    <input 
                        type="checkbox" 
                        checked={selectedIds.length === cart.length && cart.length > 0} 
                        onChange={toggleSelectAll}
                        id="select-all"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="select-all" style={{ cursor: 'pointer', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '700' }}>
                        Select All Items ({cart.length})
                    </label>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
                {/* Cart Items List */}
                <div className="flex-column gap-6">
                    {cart.map((item) => (
                        <div key={item.id} className="selection-card" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'auto 1fr auto', 
                            gap: '1.5rem', 
                            padding: '1.5rem',
                            border: selectedIds.includes(item.id) ? '2px solid var(--primary)' : '2px solid transparent',
                            background: selectedIds.includes(item.id) ? 'var(--primary-light)' : 'var(--bg-white)',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(item.id)} 
                                    onChange={() => toggleSelect(item.id)}
                                    style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div className="flex-between">
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{item.branch?.name}</h3>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>PKR {item.totalPrice}</span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ opacity: 0.7 }}>📅</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.date}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ opacity: 0.7 }}>⏰</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.timeSlots?.map(s => s.time).join(', ')}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ opacity: 0.7 }}>🧺</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.selectedMachines?.length} Units</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        Wash: {item.clothType?.programName || 'Standard'}
                                    </span>
                                    <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        Soap: {item.detergent?.name || 'None'}
                                    </span>
                                    {item.isQueued && (
                                        <span className="badge" style={{ background: '#fef2f2', color: '#ef4444', fontSize: '0.75rem', fontWeight: '800' }}>
                                            🚀 Queue Reserved
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)}
                                style={{ 
                                    background: '#fff1f2', 
                                    border: 'none', 
                                    color: '#e11d48', 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#ffe4e6'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#fff1f2'}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary Panel */}
                <aside style={{ position: 'sticky', top: '100px' }}>
                    <div className="card" style={{ padding: '2rem', border: '1px solid var(--primary-light)', background: 'linear-gradient(to bottom, #fff, var(--bg-light))' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Order Summary</h3>
                        
                        <div className="flex-column gap-5">
                            <div className="flex-between">
                                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Selected Bookings</span>
                                <span style={{ fontWeight: '800' }}>{selectedItems.length}</span>
                            </div>
                            <div className="flex-between">
                                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Total Machine Units</span>
                                <span style={{ fontWeight: '800' }}>{selectedItems.reduce((acc, item) => acc + (item.selectedMachines?.length || 0), 0)}</span>
                            </div>
                            
                            <div style={{ margin: '1.5rem 0', paddingTop: '1.5rem', borderTop: '2px dashed var(--border)' }}>
                                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Total Amount</span>
                                    <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>PKR {totalToPay}</span>
                                </div>
                                <p style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    Incl. all service taxes
                                </p>
                            </div>
                            
                            <button 
                                className="btn btn-primary" 
                                style={{ padding: '1.1rem', fontSize: '1.1rem', width: '100%', borderRadius: '16px' }} 
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                            >
                                {selectedItems.length > 0 ? `Checkout PKR ${totalToPay}` : 'Select Items to Proceed'}
                            </button>
                            
                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>
                                    🛡️ 100% Secure Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    div[style*="grid-template-columns: 1fr 380px"] {
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

