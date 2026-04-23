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
    const { bookingData, updateBooking } = useBooking();

    useEffect(() => {
        if (!bookingData.clothType) {
            navigate('/cloth-type');
        }
    }, [bookingData, navigate]);

    const [selectedDetergent, setSelectedDetergent] = useState(bookingData.detergent || null);

    const handleNext = () => {
        if (!selectedDetergent) {
            alert('Please select a detergent option.');
            return;
        }
        updateBooking('detergent', selectedDetergent);
        navigate('/machine-detail'); // Step 5
    };

    const slotsPrice = (bookingData.timeSlots || []).reduce((sum, slot) => sum + (slot.price || 0), 0);
    const currentTotal = slotsPrice + (bookingData.clothType?.price * (bookingData.numLoads || 1) || 0);

    return (
        <div className="container animate-in" style={{ maxWidth: '800px', margin: 'auto' }}>
            {/* Selection context */}
            <div style={{ backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: '600', textTransform: 'uppercase' }}>Selected Program</p>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{bookingData.clothType?.type} Wash ({bookingData.numLoads || 1} Loads)</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Running Total</p>
                    <strong style={{ fontSize: '0.95rem' }}>PKR {currentTotal}</strong>
                </div>
            </div>

            <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Step 4: Select Detergent</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Choose your cleaning agent preferences.</p>

            <div className="card">
                <h3 style={{ marginBottom: '1.25rem' }}>Detergent Options</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {DETERGENTS.map((det) => {
                        const isSelected = selectedDetergent?.id === det.id;
                        return (
                            <div
                                key={det.id}
                                onClick={() => setSelectedDetergent(det)}
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
                    <button className="btn btn-outline" onClick={() => navigate('/cloth-type')}>← Back</button>
                    
                    {selectedDetergent && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Final Selection Total</p>
                            <strong style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>PKR {currentTotal + selectedDetergent.price}</strong>
                        </div>
                    )}

                    <button className="btn btn-primary" onClick={handleNext}>Next: Choose Machine →</button>
                </div>
            </div>
        </div>
    );
}
