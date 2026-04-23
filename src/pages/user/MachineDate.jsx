import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function MachineDate() {
    const navigate = useNavigate();
    const { bookingData, updateBooking } = useBooking();

    useEffect(() => {
        if (!bookingData.branch) {
            navigate('/home');
        }
    }, [bookingData, navigate]);

    const [machineType, setMachineType] = useState(bookingData.machineType || 'Washer');
    const [date, setDate] = useState(bookingData.date || new Date().toISOString().split('T')[0]);

    const handleNext = () => {
        updateBooking('machineType', machineType);
        updateBooking('date', date);
        navigate('/time-availability');
    };

    return (
        <div className="container animate-in" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)', borderLeft: '5px solid var(--primary)' }}>
                <span style={{ fontSize: '2rem' }}>📍</span>
                <div>
                    <h3 style={{ margin: 0 }}>{bookingData.branch?.name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{bookingData.branch?.address}</p>
                </div>
            </div>

            <h1 className="text-center mb-1" style={{ color: 'var(--primary)' }}>Step 1: Type & Date</h1>
            <p className="text-center text-muted mb-8">Choose your service type and preferred date.</p>

            <div className="card">
                <div className="mb-8">
                    <h3 className="mb-4">Select Machine Type</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {['Washer', 'Dryer', 'Both'].map(type => (
                            <div 
                                key={type}
                                onClick={() => setMachineType(type)}
                                style={{
                                    padding: '1.5rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    border: `2px solid ${machineType === type ? 'var(--primary)' : 'var(--border)'}`,
                                    backgroundColor: machineType === type ? 'var(--primary-light)' : 'white',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: machineType === type ? 'var(--shadow-md)' : 'none'
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{type === 'Washer' ? '🫧' : type === 'Dryer' ? '💨' : '🫧+💨'}</div>
                                <strong style={{ fontSize: '1.1rem', color: machineType === type ? 'var(--primary)' : 'var(--text-main)' }}>{type}</strong>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {type === 'Washer' ? 'Wash clothes' : type === 'Dryer' ? 'Dry clothes' : 'Wash & Dry both'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-4">Select Date</h3>
                    <input 
                        type="date" 
                        className="input-control" 
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ padding: '1rem', fontSize: '1.1rem' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/home')}>← Change Launcher</button>
                    <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} onClick={handleNext}>Check Availability →</button>
                </div>
            </div>
        </div>
    );
}
