import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const DETERGENTS = [
    { 
        id: 'home', 
        name: 'Bring from Home', 
        price: 0, 
        icon: '🏠',
        desc: 'Use your own detergent and softener. No additional cost.',
        type: 'Free'
    },
    { 
        id: 'tide', 
        name: 'Tide Ultra Pods', 
        price: 100, 
        icon: '🟠',
        desc: 'Premium 3-in-1 pods for deep clean, brightness, and stain removal.',
        type: 'Premium'
    },
    { 
        id: 'surf', 
        name: 'Surf Excel Matic', 
        price: 80, 
        icon: '🔵',
        desc: 'Liquid detergent specifically designed for high-performance machine washing.',
        type: 'Standard'
    },
    { 
        id: 'both', 
        name: 'Both (Home + Store)', 
        price: 60, 
        icon: '📦',
        desc: 'Use your own detergent + our fabric softener and scent boosters.',
        type: 'Hybrid'
    }
];

export default function Detergent() {
    const navigate = useNavigate();
    const { bookingData, updateBooking, addToCart } = useBooking();

    useEffect(() => {
        if (!bookingData.timeSlots || bookingData.timeSlots.length === 0) {
            navigate('/time-availability');
        }
    }, [bookingData, navigate]);

    const [selectedDetergent, setSelectedDetergent] = useState(bookingData.detergent || null);

    const selectAndNavigate = (det) => {
        setSelectedDetergent(det);
        updateBooking('detergent', det);
        
        // Pass the detergent directly to addToCart to avoid stale state issues
        addToCart(det);
        navigate('/cart');
    };

    const slotsPrice = (bookingData.timeSlots || []).reduce((sum, slot) => sum + (slot.price || 0), 0);
    
    // Calculate machine price
    let machinesPrice = 0;
    if (bookingData.machineQuantities && bookingData.selectedMachines) {
        bookingData.selectedMachines.forEach(m => {
            machinesPrice += m.price;
        });
    }

    const currentTotal = slotsPrice + machinesPrice;

    return (
        <div className="container animate-in" style={{ maxWidth: '800px', margin: 'auto' }}>
            {/* Selection context */}
            <div style={{ backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: '600', textTransform: 'uppercase' }}>Selected Details</p>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{bookingData.clothType?.programName || bookingData.clothType?.type} Wash • {bookingData.selectedMachines?.length || 0} Machine(s)</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Total</p>
                    <strong style={{ fontSize: '0.95rem' }}>PKR {currentTotal}</strong>
                </div>
            </div>

            <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Step 5: Select Detergent</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Choose your cleaning agent. Clicking an option will add it to your cart.</p>

            <div className="card">
                <h3 style={{ marginBottom: '1.25rem' }}>Detergent Options</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {DETERGENTS.map((det) => {
                        const isSelected = selectedDetergent?.id === det.id;
                        return (
                            <div
                                key={det.id}
                                onClick={() => selectAndNavigate(det)}
                                style={{
                                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius)',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-white)',
                                    transition: 'all 0.2s',
                                    transform: isSelected ? 'translateY(-2px)' : 'none',
                                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <div style={{ fontSize: '2rem', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'var(--bg-white)' : 'var(--bg-light)', borderRadius: '10px' }}>
                                            {det.icon}
                                        </div>
                                        <span className={`badge ${det.type === 'Premium' ? 'badge-primary' : det.type === 'Free' ? 'badge-success' : 'badge-warning'}`}>
                                            {det.type}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: '0 0 0.25rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.05rem' }}>{det.name}</h3>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>{det.desc}</p>
                                </div>
                                <div style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                                    <strong style={{ fontSize: '1.2rem', color: det.price === 0 ? 'var(--success)' : 'var(--text-main)' }}>
                                        {det.price === 0 ? 'FREE' : `+PKR ${det.price}`}
                                    </strong>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/time-availability')}>← Back</button>
                    
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select an option above to proceed</p>
                    </div>

                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Confirm & Add to Cart →</button>
                </div>
            </div>
        </div>
    );
}
