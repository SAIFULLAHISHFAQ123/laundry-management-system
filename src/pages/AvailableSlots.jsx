import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClock, FaCheckCircle } from "react-icons/fa";

// Helper function to generate time slots based on shop hours and cloth duration
const generateTimeSlots = (hoursString, durationMinutes) => {
    const [startTimeStr, endTimeStr] = (hoursString || "8 AM - 10 PM").split(" - ");

    const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.trim().split(" ");
        let [hours, minutes = "00"] = time.split(":");
        hours = parseInt(hours, 10);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return { hours, minutes: parseInt(minutes, 10) };
    };

    const start = parseTime(startTimeStr);
    const end = parseTime(endTimeStr);

    const slots = [];
    let currentHour = start.hours;
    let currentMinute = start.minutes;
    const endTotalMinutes = end.hours * 60 + end.minutes;

    while (true) {
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        if (currentTotalMinutes + durationMinutes > endTotalMinutes) break;

        const hour12 = currentHour % 12 || 12;
        const ampm = currentHour < 12 ? "AM" : "PM";
        const minuteStr = currentMinute.toString().padStart(2, '0');
        slots.push(`${hour12}:${minuteStr} ${ampm}`);

        currentMinute += durationMinutes;
        // Optimization: round to nearest 5 or 10 if needed, but let's keep it exact for now
        while (currentMinute >= 60) {
            currentHour += 1;
            currentMinute -= 60;
        }
    }
    return slots;
};

export default function AvailableSlots() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        shop,
        machine,
        date,
        selectedWeight,
        selectedClothType,
        selectedDetergent
    } = location.state || {};

    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availability, setAvailability] = useState({});

    useEffect(() => {
        if (shop?.hours && selectedClothType?.spinTime) {
            const durationArr = selectedClothType.spinTime.split(" ");
            const duration = parseInt(durationArr[0], 10) || 40;

            const slots = generateTimeSlots(shop.hours, duration);
            setTimeSlots(slots);

            // Mock availability logic including "about-to-free" (yellow)
            const avail = {};
            slots.forEach((s, index) => {
                const rand = Math.random();
                if (rand > 0.4) {
                    avail[s] = "available"; // Green
                } else if (rand > 0.15) {
                    avail[s] = "busy"; // Red
                } else {
                    avail[s] = "about-to-free"; // Yellow (Free in 10 mins)
                }
            });
            setAvailability(avail);
        }
    }, [shop, selectedClothType]);

    const handleAddToCart = () => {
        if (!selectedSlot) {
            alert("Please select a time slot");
            return;
        }

        const spinTime = selectedClothType?.spinTime || "40 mins";
        const durationArr = spinTime.split(" ");
        const duration = parseInt(durationArr[0], 10) || 40;
        const slotPrice = Math.round(duration * 12.5); // 40m = 500 PKR, 30m = 375 PKR, 60m = 750 PKR
        const total = slotPrice + (selectedDetergent?.price || 0);

        navigate("/cart", {
            state: {
                shop,
                machine,
                date,
                time: selectedSlot,
                selectedWeight,
                selectedClothType,
                selectedDetergent,
                spinTime,
                totalPrice: total
            }
        });
    };

    const getStatusText = (status) => {
        if (status === "available") return "Available";
        if (status === "busy") return "Busy";
        if (status === "about-to-free") return "Free in 10m";
        return status;
    };

    return (
        <div className="screen">
            <div className="process-header">
                <button className="back-button-professional" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h2>Available Slots</h2>
                    <p className="subtitle">{selectedClothType?.name} Service • {selectedClothType?.spinTime} Duration</p>
                </div>
            </div>

            <div className="flow-container">
                <div className="selection-card">
                    <div className="card-header">
                        <FaClock className="header-icon" />
                        <h3>{date} - Slots at {shop?.name}</h3>
                    </div>

                    <div className="slots-grid-professional">
                        {timeSlots.map((slot) => {
                            const status = availability[slot];
                            const isSelected = selectedSlot === slot;

                            return (
                                <button
                                    key={slot}
                                    className={`slot-chip ${status} ${isSelected ? 'active' : ''}`}
                                    onClick={() => status !== "busy" && setSelectedSlot(slot)}
                                    disabled={status === "busy"}
                                >
                                    <span className="slot-time">{slot}</span>
                                    <span className="slot-status">{getStatusText(status)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="status-legend">
                    <div className="legend-item"><span className="dot green"></span> Available</div>
                    <div className="legend-item"><span className="dot yellow"></span> Free Soon (10m)</div>
                    <div className="legend-item"><span className="dot red"></span> Occupied</div>
                </div>
            </div>

            <div className="sticky-action-bar">
                <div className="selection-summary">
                    <p><span>Time:</span> {selectedSlot || 'Not Selected'}</p>
                    <p><span>Total:</span> {selectedSlot ? `PKR ${Math.round((parseInt((selectedClothType?.spinTime || "40").split(" ")[0]) || 40) * 12.5) + (selectedDetergent?.price || 0)}` : '--'}</p>
                </div>
                <button
                    className={`continue-btn-pro ${!selectedSlot ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!selectedSlot}
                >
                    Add to Cart <FaCheckCircle style={{ marginLeft: '8px' }} />
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .status-legend {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-top: 1rem;
                    padding: 1rem;
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-muted);
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                .dot.green { background: #10b981; }
                .dot.yellow { background: #f59e0b; }
                .dot.red { background: #ef4444; }
            `}} />
        </div>
    );
}
