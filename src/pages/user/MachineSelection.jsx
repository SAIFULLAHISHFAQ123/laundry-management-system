import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { FaWeightHanging, FaPlus, FaMinus } from 'react-icons/fa';
import '../../styles/user.css';

const MachineSelection = () => {
    const navigate = useNavigate();
    const { bookingData, updateBooking } = useBooking();

    // Local state for quantities
    const [quantities, setQuantities] = useState(bookingData.machineQuantities || {
        '5kg': 0,
        '7kg': 0,
        '10kg': 0
    });

    const updateQuantity = (weight, delta) => {
        const newValue = Math.max(0, (quantities[weight] || 0) + delta);
        const newQuantities = { ...quantities, [weight]: newValue };
        setQuantities(newQuantities);
        updateBooking('machineQuantities', newQuantities);
    };

    const handleContinue = () => {
        const totalMachines = Object.values(quantities).reduce((a, b) => a + b, 0);
        if (totalMachines === 0) {
            alert('Please select at least one machine.');
            return;
        }
        navigate('/home'); // Go to Map screen
    };

    const weights = [
        { id: '5kg', label: '5 KG', desc: 'Small load, daily items', icon: '👕' },
        { id: '7kg', label: '7 KG', desc: 'Medium load, bedsheets', icon: '🛌' },
        { id: '10kg', label: '10 KG', desc: 'Large load, curtains/rugs', icon: '🧺' }
    ];

    return (
        <div className="user-container fade-in">
            <div className="booking-card">
                <div className="header-section">
                    <h1 className="title">Select Machine Capacity</h1>
                    <p className="subtitle">How many machines do you need of each capacity?</p>
                </div>

                <div className="weight-selection-list">
                    {weights.map((w) => (
                        <div key={w.id} className={`weight-item ${quantities[w.id] > 0 ? 'selected' : ''}`}>
                            <div className="weight-info">
                                <div className="weight-icon-box">{w.icon}</div>
                                <div className="weight-text">
                                    <h4>{w.label} Capacity</h4>
                                    <p>{w.desc}</p>
                                </div>
                            </div>
                            
                            <div className="quantity-controls">
                                <button 
                                    className="qty-btn" 
                                    onClick={() => updateQuantity(w.id, -1)}
                                    disabled={quantities[w.id] === 0}
                                >
                                    <FaMinus />
                                </button>
                                <span className="qty-value">{quantities[w.id]}</span>
                                <button 
                                    className="qty-btn plus" 
                                    onClick={() => updateQuantity(w.id, 1)}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="action-buttons">
                    <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
                    <button 
                        className="btn-primary" 
                        onClick={handleContinue}
                    >
                        Find Laundries
                    </button>
                </div>
            </div>

            <style jsx>{`
                .weight-selection-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin: 30px 0;
                }
                .weight-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    background: var(--bg-white);
                    border-radius: 20px;
                    border: 2px solid var(--border);
                    transition: all 0.3s ease;
                }
                .weight-item.selected {
                    border-color: var(--primary);
                    background: var(--primary-light);
                    box-shadow: var(--shadow-md);
                }
                .weight-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .weight-icon-box {
                    font-size: 24px;
                    width: 50px;
                    height: 50px;
                    background: var(--bg-light);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--shadow-sm);
                }
                .weight-text h4 {
                    margin: 0;
                    color: var(--text-main);
                    font-size: 16px;
                }
                .weight-text p {
                    margin: 5px 0 0;
                    color: var(--text-muted);
                    font-size: 13px;
                }
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .qty-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    border: none;
                    background: var(--bg-white);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border);
                }
                .qty-btn:hover:not(:disabled) {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }
                .qty-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .qty-value {
                    font-weight: 800;
                    font-size: 20px;
                    min-width: 30px;
                    text-align: center;
                    color: var(--text-main);
                }
            `}</style>
        </div>
    );
};

export default MachineSelection;
