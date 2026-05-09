import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { fetchAvailableMachines, getAvailableMachines } from '../../services/MachineService';

export default function MachineDetail() {

    const navigate = useNavigate();
    const { bookingData, updateBooking } = useBooking();

    const [availableMachines, setAvailableMachines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    // SELECTED PROGRAM (FROM DATABASE STEP)
    const selectedProgram = bookingData.clothType;

    // SAFETY CHECK
    useEffect(() => {
        if (!bookingData.clothType) {
            navigate('/cloth-type');
        }
    }, [bookingData, navigate]);

    // LOAD MACHINES
    useEffect(() => {

        let isMounted = true;

        const loadMachines = async () => {

            if (!bookingData.branch) return;

            setIsLoading(true);
            setLoadError('');

            try {

                const machines = await fetchAvailableMachines(
                    bookingData.branch,
                    bookingData.machineType || 'Both'
                );

                if (isMounted) setAvailableMachines(machines);

            } catch (error) {

                console.error('API error:', error);

                if (!isMounted) return;

                setAvailableMachines(
                    getAvailableMachines(
                        bookingData.branch,
                        bookingData.machineType || 'Both'
                    )
                );

                setLoadError('Using offline sample data');
            }
            finally {

                if (isMounted) setIsLoading(false);
            }
        };

        loadMachines();

        return () => {
            isMounted = false;
        };

    }, [bookingData.branch, bookingData.machineType]);

    // GROUP MACHINES + APPLY PROGRAM PRICE
    const groupedMachines = useMemo(() => {

        const groups = {};

        availableMachines.forEach(m => {

            if (!groups[m.capacity]) {

                groups[m.capacity] = {

                    capacity: m.capacity,

                    // 🔥 PROGRAM-BASED PRICE LOGIC
                    price:
                        selectedProgram?.programPrice
                        || m.price
                        || (m.capacity === '5kg' ? 200 :
                            m.capacity === '7kg' ? 300 :
                                m.capacity === '10kg' ? 500 : 300),

                    availableCount: 0,
                    machines: []
                };
            }

            groups[m.capacity].availableCount += 1;
            groups[m.capacity].machines.push(m);

        });

        return Object.values(groups).sort(
            (a, b) => parseInt(a.capacity) - parseInt(b.capacity)
        );

    }, [availableMachines, selectedProgram]);

    const [selectedQuantities, setSelectedQuantities] = useState({});

    // QUANTITY CONTROL
    const handleQuantityChange = (capacity, newQuantity) => {

        const group = groupedMachines.find(g => g.capacity === capacity);

        if (newQuantity > group.availableCount) {
            alert(`Only ${group.availableCount} machines available`);
            return;
        }

        if (newQuantity < 0) return;

        setSelectedQuantities(prev => ({
            ...prev,
            [capacity]: newQuantity
        }));
    };

    // NEXT
    const handleNext = () => {

        const totalSelected =
            Object.values(selectedQuantities).reduce((a, b) => a + b, 0);

        if (totalSelected === 0) {
            alert('Select at least one machine');
            return;
        }

        const selectedMachinesList = [];

        groupedMachines.forEach(g => {

            const qty = selectedQuantities[g.capacity] || 0;

            for (let i = 0; i < qty; i++) {
                selectedMachinesList.push(g.machines[i]);
            }

        });

        updateBooking('selectedMachines', selectedMachinesList);
        updateBooking('machineQuantities', selectedQuantities);

        navigate('/time-availability');
    };

    // TOTAL PRICE
    const totalMachinePrice = groupedMachines.reduce((sum, g) => {

        return sum + (g.price * (selectedQuantities[g.capacity] || 0));

    }, 0);

    return (
        <div className="container animate-in" style={{ maxWidth: '1000px', margin: 'auto', padding: '2rem 1rem' }}>
            {/* Header Section */}
            <div className="flex-between mb-10" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Select Units</h1>
                    <p className="text-muted">Available at <strong style={{ color: 'var(--primary)' }}>{bookingData.branch?.name}</strong></p>
                </div>
                <div className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem' }}>
                    Program: {selectedProgram?.programName}
                </div>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div className="flex-between mb-8">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Choose Capacity</h3>
                    {loadError && <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700' }}>⚠️ {loadError}</span>}
                </div>

                {isLoading ? (
                    <div className="text-center p-12">
                        <div className="brand-icon animate-pulse" style={{ margin: '0 auto 1.5rem' }}>L</div>
                        <p className="text-muted">Scanning for available machines...</p>
                    </div>
                ) : groupedMachines.length === 0 ? (
                    <div className="text-center p-12 bg-light" style={{ borderRadius: '20px' }}>
                        <p className="text-muted">No machines are currently available for this location.</p>
                        <button className="btn btn-outline mt-4" onClick={() => navigate('/home')}>Change Location</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {groupedMachines.map((group) => {
                            const qty = selectedQuantities[group.capacity] || 0;
                            const isSelected = qty > 0;
                            return (
                                <div
                                    key={group.capacity}
                                    className={`machine-card ${isSelected ? 'selected' : ''}`}
                                    style={{ 
                                        padding: '2rem',
                                        borderRadius: '24px',
                                        border: isSelected ? '2px solid var(--primary)' : '2px solid var(--bg-light)',
                                        background: isSelected ? 'var(--primary-light)' : 'var(--bg-white)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isSelected ? '0 15px 30px rgba(14, 165, 233, 0.1)' : 'none'
                                    }}
                                >
                                    <div className="flex-between">
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: isSelected ? 'var(--bg-white)' : 'var(--bg-light)', 
                                            borderRadius: '16px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            fontSize: '1.8rem',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                        }}>
                                            {group.capacity === '10kg' ? '🐘' : group.capacity === '7kg' ? '🧺' : '👕'}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{group.capacity}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700' }}>{group.availableCount} Units Ready</div>
                                        </div>
                                    </div>

                                    <div className="flex-between" style={{ background: isSelected ? 'rgba(255,255,255,0.5)' : 'var(--bg-light)', padding: '1rem', borderRadius: '16px' }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Price per unit</span>
                                            <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>PKR {group.price}</strong>
                                        </div>
                                        <div className="qty-box" style={{ background: 'var(--bg-white)', borderRadius: '12px', padding: '4px' }}>
                                            <button 
                                                className="btn-qty"
                                                onClick={() => handleQuantityChange(group.capacity, qty - 1)}
                                                disabled={qty === 0}
                                                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '800' }}
                                            >
                                                −
                                            </button>
                                            <span style={{ padding: '0 1rem', fontWeight: '800', fontSize: '1.1rem' }}>{qty}</span>
                                            <button 
                                                className="btn-qty"
                                                onClick={() => handleQuantityChange(group.capacity, qty + 1)}
                                                disabled={qty >= group.availableCount}
                                                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '800', color: 'var(--primary)' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex-between" style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '2px dashed var(--border)' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/cloth-type')} style={{ padding: '0.8rem 2rem' }}>
                        ← Back
                    </button>
                    
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Estimation</p>
                            <strong style={{ fontSize: '1.8rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>PKR {totalMachinePrice}</strong>
                        </div>
                        <button className="btn btn-primary" onClick={handleNext} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Schedule Time →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}