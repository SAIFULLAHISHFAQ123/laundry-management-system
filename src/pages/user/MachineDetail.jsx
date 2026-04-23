import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { getAvailableMachines } from '../../services/MachineService';

export default function MachineDetail() {
    const navigate = useNavigate();
    const { bookingData, updateBooking, addToCart } = useBooking();

    // Safety check - must have detergent selection to be here
    useEffect(() => {
        if (!bookingData.detergent) {
            navigate('/detergent');
        }
    }, [bookingData, navigate]);

    const availableMachines = getAvailableMachines(bookingData.branch, bookingData.machineType);
    const [selectedMachine, setSelectedMachine] = useState(bookingData.machine || null);

    const handleAddToCart = () => {
        if (!selectedMachine) {
            alert('Please select a specific machine to proceed.');
            return;
        }
        updateBooking('machine', selectedMachine);
        addToCart(); 
        navigate('/cart');
    };

    const slotsPrice = (bookingData.timeSlots || []).reduce((sum, slot) => sum + (slot.price || 0), 0);
    const bookingTotal = slotsPrice + 
                         ((bookingData.clothType?.price || 0) * (bookingData.numLoads || 1)) + 
                         (bookingData.detergent?.price || 0);

    return (
        <div className="container animate-in" style={{ maxWidth: '900px', margin: 'auto' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Step 5: Assign Machine</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Select one of the available {bookingData.machineType} units at {bookingData.branch?.name}.
            </p>

            <div className="cart-layout">
                {/* Machine Selection */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.25rem' }}>Available Units</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                        {availableMachines.length === 0 ? (
                            <div className="text-center p-6 text-muted">
                                <p>No {bookingData.machineType}s are currently available for this branch.</p>
                            </div>
                        ) : (
                            availableMachines.map((mach) => {
                                const isSelected = selectedMachine?.id === mach.id;
                                return (
                                    <div
                                        key={mach.id}
                                        onClick={() => setSelectedMachine(mach)}
                                        style={{
                                            border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                            padding: '1.25rem',
                                            borderRadius: 'var(--radius)',
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-white)',
                                            textAlign: 'center',
                                            transition: 'all 0.2s',
                                            transform: isSelected ? 'translateY(-3px)' : 'none',
                                            boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                                        }}
                                    >
                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                            {mach.machineType === 'Washer' ? '🫧' : '💨'}
                                        </div>
                                        <strong style={{ display: 'block', fontSize: '1.1rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>{mach.id}</strong>
                                        <div className="badge badge-primary mt-2">{mach.capacity}</div>
                                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status: <span style={{ color: 'var(--success)', fontWeight: '700' }}>{mach.status}</span></p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Selection Summary</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Branch</span>
                            <strong>{bookingData.branch?.name}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Date & Slots</span>
                            <div style={{ textAlign: 'right' }}>
                                <strong>{bookingData.date}</strong><br/>
                                <small style={{ color: 'var(--primary)' }}>{bookingData.timeSlots?.map(s => s.time).join(', ')}</small>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Type</span>
                            <strong>{bookingData.machineType}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Program</span>
                            <strong>{bookingData.clothType?.type}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Detergent</span>
                            <strong>{bookingData.detergent?.name}</strong>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Final Amount</span>
                                <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>PKR {bookingTotal}</strong>
                            </div>
                            
                            <button 
                                className="btn btn-primary" 
                                style={{ width: '100%', padding: '1rem' }} 
                                onClick={handleAddToCart}
                                disabled={!selectedMachine}
                            >
                                Confirm & Add to Cart
                            </button>
                            <button 
                                className="btn btn-outline" 
                                style={{ width: '100%', marginTop: '0.75rem' }} 
                                onClick={() => navigate('/detergent')}
                            >
                                ← Change Options
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
