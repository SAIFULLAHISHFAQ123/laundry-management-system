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
        <div className="container animate-in">
            <header className="page-header">
                <h1 className="title-primary">My Laundry Basket</h1>
                <button className="btn btn-outline" onClick={handleAddAnother}>+ Add New</button>
            </header>

            <div className="cart-layout">
                {/* Cart Items List */}
                <div className="flex-column gap-4">
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item-card">
                            <div style={{ padding: '0.25rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(item.id)} 
                                    onChange={() => toggleSelect(item.id)}
                                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                />
                            </div>
                            
                            <div className="cart-item-info">
                                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{item.branch?.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="badge badge-primary">{item.machineType}</span>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {item.machine?.id}</span>
                                        </div>
                                    </div>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>PKR {item.totalPrice}</strong>
                                </div>
                                
                                <div className="item-details-row">
                                    <div>
                                        <span className="text-muted">Slots:</span> <strong>{item.date} @ {item.timeSlots?.map(s => s.time).join(', ')}</strong>
                                        {item.isQueued && <span className="badge badge-warning" style={{ marginLeft: '8px' }}>Queue Reserved</span>}
                                    </div>
                                    <div>
                                        <span className="text-muted">Wash:</span> <strong>{item.clothType?.type}</strong>
                                    </div>
                                    <div>
                                        <span className="text-muted">Soap:</span> <strong>{item.detergent?.name}</strong>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="btn-logout"
                                style={{ padding: '0.6rem', borderRadius: '50%' }}
                                title="Remove item"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary Panel */}
                <aside className="sticky-summary">
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                        
                        <div className="flex-column gap-4">
                            <div className="flex-between">
                                <span className="text-muted">Selected Baskets</span>
                                <strong>{selectedItems.length}</strong>
                            </div>
                            <div className="flex-between">
                                <span className="text-muted">Total Load Weight</span>
                                <strong>~ {selectedItems.length * 7}kg</strong>
                            </div>
                            
                            <div className="summary-total-section">
                                <div className="flex-between" style={{ alignItems: 'flex-end', marginBottom: '2rem' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>Estimated Total</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="summary-total-price">PKR {totalToPay}</span>
                                        <small className="text-muted">Cash on Arrival</small>
                                    </div>
                                </div>
                                
                                <button 
                                    className="btn btn-primary w-full" 
                                    style={{ padding: '1rem', fontSize: '1.1rem' }} 
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <p className="text-center mt-4" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Final invoice will be generated upon confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
