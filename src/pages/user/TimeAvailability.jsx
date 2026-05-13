import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { generateTimeSlots } from '../../utils/timeSlotGenerator';

export default function TimeAvailability() {
    const navigate = useNavigate();
    const { bookingData, updateBooking, reservations } = useBooking();

    useEffect(() => {
        if (!bookingData.selectedMachines || bookingData.selectedMachines.length === 0) {
            navigate('/machine-detail');
        }
    }, [bookingData, navigate]);

    const [selectedSlots, setSelectedSlots] = useState(() => {
        if (Array.isArray(bookingData.timeSlots) && bookingData.timeSlots.length > 0) {
            const initial = Array(bookingData.selectedMachines?.length || 0).fill().map(() => []);
            bookingData.timeSlots.forEach(slot => {
                const mIndex = bookingData.selectedMachines?.findIndex(m => m.id === slot.machineId);
                if (mIndex >= 0) {
                    initial[mIndex].push(slot);
                }
            });
            return initial;
        }
        return Array(bookingData.selectedMachines?.length || 0).fill().map(() => []);
    });

    const [durationMins, setDurationMins] = useState(45);
    const [isLoading, setIsLoading] = useState(true);

    const totalMachinesSelected = bookingData.selectedMachines ? bookingData.selectedMachines.length : 0;
    const displayDate = bookingData.date || new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDuration = async () => {
            if (bookingData.clothType?.durationMinutes) {
                setDurationMins(parseInt(bookingData.clothType.durationMinutes));
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch('https://localhost:7208/api/machineprograms');
                const data = await res.json();
                const programInfo = data.find(p => p.programName === bookingData.clothType?.programName);
                if (programInfo) {
                    setDurationMins(programInfo.durationMinutes);
                }
            } catch (err) {
                console.error("Duration fetch failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDuration();
    }, [bookingData.clothType]);

    const toggleSlot = (machineIndex, slot) => {
        const newSelectedSlots = [...selectedSlots];
        const machineSlots = [...(newSelectedSlots[machineIndex] || [])];

        const existingIndex = machineSlots.findIndex(s => s.time === slot.time);
        if (existingIndex >= 0) {
            machineSlots.splice(existingIndex, 1);
        } else {
            machineSlots.push(slot);
        }

        newSelectedSlots[machineIndex] = machineSlots;
        setSelectedSlots(newSelectedSlots);
    };

    const handleNext = () => {
        const hasMissing = selectedSlots.some(slots => !slots || slots.length === 0);
        if (hasMissing || selectedSlots.length !== totalMachinesSelected) {
            alert(`Please select at least one time slot for each machine.`);
            return;
        }

        const flatSlots = selectedSlots.flatMap((slots, index) =>
            slots.map(slot => ({ ...slot, machineId: bookingData.selectedMachines[index].id }))
        );

        updateBooking('timeSlots', flatSlots);
        updateBooking('date', displayDate);
        navigate('/detergent');
    };

    return (
        <div className="container animate-in" style={{ maxWidth: '1000px', margin: 'auto', padding: '2rem 1rem' }}>
            {/* Header Section */}
            <div className="flex-between mb-10" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Reserve Time</h1>
                    <p className="text-muted"><strong style={{ color: 'var(--primary)' }}>{bookingData.branch?.name}</strong> • {displayDate}</p>
                </div>
                <div className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem' }}>
                    {totalMachinesSelected} Units Selected
                </div>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ 
                    marginBottom: '2.5rem', 
                    background: 'linear-gradient(to right, var(--primary-light), #fff)', 
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '2rem' }}>⏱️</div>
                    <div>
                        <p style={{ margin: 0, fontWeight: '800', color: 'var(--primary-dark)', fontSize: '1.1rem' }}>
                            {bookingData.clothType?.programName}
                        </p>
                        <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                            Optimized for selected fabric type
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '6px', border: '2px solid var(--border)', background: 'white' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '6px', background: 'var(--primary)', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Selected</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '6px', background: 'var(--bg-light)', border: '1px solid var(--border)' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Booked</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center p-12">
                        <div className="brand-icon animate-pulse" style={{ margin: '0 auto 1.5rem' }}>L</div>
                        <p className="text-muted">Syncing real-time availability...</p>
                    </div>
                ) : (
                    bookingData.selectedMachines && bookingData.selectedMachines.map((machine, machineIndex) => {
                        const machineSlots = generateTimeSlots(
                            bookingData.branch?.basePrice || 500,
                            durationMins,
                            machine.id,
                            displayDate,
                            reservations
                        );

                        return (
                            <div key={machineIndex} style={{ marginBottom: '4rem', animation: `fadeIn 0.5s ease ${machineIndex * 0.1}s both` }}>
                                <div className="flex-between mb-6" style={{ background: 'var(--bg-light)', padding: '1rem 1.5rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                            {machineIndex + 1}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>
                                                {machine.capacity} Unit
                                            </h3>
                                            <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Serial: {machine.name || machine.id}</small>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', background: 'var(--bg-white)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                        Pick 1 or more slots
                                    </span>
                                </div>
                                
                                <div className="slot-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                                    {machineSlots.map((slot, idx) => {
                                        const isSelected = selectedSlots[machineIndex]?.some(s => s.time === slot.time);
                                        const isBooked = slot.status === 'Booked';

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => !isBooked && toggleSlot(machineIndex, slot)}
                                                className={`slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                                            >
                                                {slot.time}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}

                <div className="flex-between" style={{ marginTop: '2rem', paddingTop: '2.5rem', borderTop: '2px dashed var(--border)' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/machine-detail')} style={{ padding: '0.8rem 2rem' }}>
                        ← Back
                    </button>
                    <button className="btn btn-primary" onClick={handleNext} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Review Order →
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

