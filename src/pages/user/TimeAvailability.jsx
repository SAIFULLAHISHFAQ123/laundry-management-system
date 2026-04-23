import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { generateTimeSlots } from '../../utils/timeSlotGenerator';

export default function TimeAvailability() {
    const navigate = useNavigate();
    const { bookingData, updateBooking } = useBooking();

    useEffect(() => {
        if (!bookingData.date) {
            navigate('/machine-date');
        }
    }, [bookingData, navigate]);

    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState(Array.isArray(bookingData.timeSlots) ? bookingData.timeSlots : []);

    useEffect(() => {
        // In real app, fetch from service based on date/branch
        setSlots(generateTimeSlots(bookingData.branch?.basePrice));
    }, [bookingData.branch, bookingData.date]);

    const toggleSlot = (slot) => {
        const isAlreadySelected = selectedSlots.some(s => s.time === slot.time);
        if (isAlreadySelected) {
            setSelectedSlots(selectedSlots.filter(s => s.time !== slot.time));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const handleNext = () => {
        if (selectedSlots.length === 0) {
            alert('Please select at least one time slot.');
            return;
        }
        updateBooking('timeSlots', selectedSlots);
        navigate('/cloth-type');
    };

    return (
        <div className="container animate-in" style={{ maxWidth: '900px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)', margin: 0 }}>Step 2: Time Slot</h1>
                    <p className="text-muted">{bookingData.branch?.name} • {bookingData.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-primary">{bookingData.machineType} Requested</span>
                </div>
            </div>

            <div className="card">
                {/* Legend */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '4px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)' }}></span>
                        <span>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '4px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}></span>
                        <span>Booked</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '4px', backgroundColor: 'var(--primary)', border: '1px solid var(--primary)' }}></span>
                        <span>Selected</span>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 'bold' }}>
                        <span>⚡ Peak Rate (+PKR 100)</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    {slots.map((slot, idx) => {
                        const isSelected = selectedSlots.some(s => s.time === slot.time);
                        const isBooked = slot.status === 'Booked';

                        return (
                            <div
                                key={idx}
                                onClick={() => !isBooked && toggleSlot(slot)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                    border: `2px solid ${isSelected ? 'var(--primary)' : isBooked ? 'transparent' : '#86efac'}`,
                                    backgroundColor: isSelected ? 'var(--primary)' : isBooked ? '#f1f5f9' : 'var(--bg-white)',
                                    color: isSelected ? 'white' : isBooked ? '#94a3b8' : 'var(--text-main)',
                                    position: 'relative',
                                    transition: 'all 0.2s',
                                    opacity: isBooked ? 0.6 : 1
                                }}
                            >
                                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{slot.time}</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>PKR {slot.price}</div>
                                {slot.isPeak && !isBooked && (
                                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '0.8rem' }}>⚡</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed var(--border)', paddingTop: '2rem' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/machine-date')}>← Back</button>
                    
                    {selectedSlots.length > 0 && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Slots</p>
                            <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{selectedSlots.length} Slots</strong>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {selectedSlots.map(s => s.time).join(', ')}
                            </div>
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} onClick={handleNext}>Next: Clothes →</button>
                </div>
            </div>
        </div>
    );
}
