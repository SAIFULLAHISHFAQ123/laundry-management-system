import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { FaTshirt, FaWind } from 'react-icons/fa';
import '../../styles/user.css';

const MachineType = () => {
    const navigate = useNavigate();
    const { bookingData, updateBooking } = useBooking();
    const [selectedDate, setSelectedDate] = React.useState(bookingData.date || new Date().toISOString().split('T')[0]);

    const handleSelect = (type) => {
        updateBooking('machineType', type);
    };

    const handleContinue = () => {
        if (!bookingData.machineType) {
            alert('Please select a service type.');
            return;
        }
        updateBooking('date', selectedDate);
        navigate('/cloth-type');
    };

    return (
        <div className="user-container fade-in">
            <div className="booking-card">
                <div className="header-section">
                    <h1 className="title" style={{ color: 'var(--primary-dark)' }}>Start Your Laundry Journey</h1>
                    <p className="subtitle">Select your service and preferred date</p>
                </div>

                <div className="date-picker-section" style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Choose Date</label>
                    <input 
                        type="date" 
                        className="input-control"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '2px solid var(--border)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                        }}
                    />
                </div>

                <div className="type-selection-grid">
                    <div 
                        className={`type-card ${bookingData.machineType === 'Washer' ? 'active' : ''}`}
                        onClick={() => handleSelect('Washer')}
                    >
                        <div className="icon-wrapper">
                            <FaTshirt className="type-icon" />
                        </div>
                        <h3>Washer</h3>
                        <p>Deep clean for your daily clothes</p>
                        <div className="selection-indicator"></div>
                    </div>

                    <div 
                        className={`type-card ${bookingData.machineType === 'Dryer' ? 'active' : ''}`}
                        onClick={() => handleSelect('Dryer')}
                    >
                        <div className="icon-wrapper">
                            <FaWind className="type-icon" />
                        </div>
                        <h3>Dryer</h3>
                        <p>Quick dry and fluff your laundry</p>
                        <div className="selection-indicator"></div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
                    <button 
                        className="btn-primary" 
                        onClick={handleContinue}
                        disabled={!bookingData.machineType}
                    >
                        Next Step
                    </button>
                </div>
            </div>

            <style jsx>{`
                .type-selection-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                .type-card {
                    background: var(--bg-white);
                    border: 2px solid var(--border);
                    border-radius: 24px;
                    padding: 30px 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .type-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary);
                    box-shadow: var(--shadow-lg);
                }
                .type-card.active {
                    border-color: var(--primary);
                    background: var(--primary-light);
                }
                .icon-wrapper {
                    width: 70px;
                    height: 70px;
                    background: var(--bg-light);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    transition: all 0.3s ease;
                }
                .type-card.active .icon-wrapper {
                    background: var(--primary);
                    color: white;
                }
                .type-icon {
                    font-size: 30px;
                    color: var(--text-muted);
                }
                .type-card.active .type-icon {
                    color: white;
                }
                .type-card h3 {
                    margin: 0 0 10px;
                    color: var(--text-main);
                    font-size: 20px;
                    font-weight: 800;
                }
                .type-card p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 14px;
                }
                .selection-indicator {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: var(--primary);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }
                .type-card.active .selection-indicator {
                    transform: scaleX(1);
                }
            `}</style>
        </div>
    );
};

export default MachineType;
