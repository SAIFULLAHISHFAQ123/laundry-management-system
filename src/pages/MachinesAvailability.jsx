import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaMicrochip, FaCogs } from "react-icons/fa";

// Sample machines for each shop
const shopMachines = {
  "QuickClean Laundry": [
    { id: 1, name: "Washer A-01", type: "washer" },
    { id: 2, name: "Washer A-02", type: "washer" },
    { id: 3, name: "Washer A-03", type: "washer" },
    { id: 101, name: "Dryer D-01", type: "dryer" },
    { id: 102, name: "Dryer D-02", type: "dryer" }
  ],
  "Fresh & Clean": [
    { id: 1, name: "Washer B-01", type: "washer" },
    { id: 2, name: "Washer B-02", type: "washer" },
    { id: 101, name: "Dryer D-01", type: "dryer" },
    { id: 102, name: "Dryer D-02", type: "dryer" }
  ],
  "Sparkle Wash": [
    { id: 1, name: "Washer C-01", type: "washer" },
    { id: 2, name: "Washer C-02", type: "washer" },
    { id: 101, name: "Dryer D-01", type: "dryer" },
    { id: 102, name: "Dryer D-02", type: "dryer" }
  ],
  "White & Bright": [
    { id: 1, name: "Washer D-01", type: "washer" },
    { id: 2, name: "Washer D-02", type: "washer" },
    { id: 101, name: "Dryer D-01", type: "dryer" }
  ],
  "Laundry Express": [
    { id: 1, name: "Washer E-01", type: "washer" },
    { id: 2, name: "Washer E-02", type: "washer" },
    { id: 3, name: "Washer E-03", type: "washer" },
    { id: 101, name: "Dryer D-01", type: "dryer" },
    { id: 102, name: "Dryer D-02", type: "dryer" }
  ],
  "Premium Wash": [
    { id: 1, name: "Washer P-01", type: "washer" },
    { id: 2, name: "Washer P-02", type: "washer" },
    { id: 101, name: "Dryer PD-01", type: "dryer" }
  ],
  "City Laundry": [
    { id: 1, name: "Washer CL-01", type: "washer" },
    { id: 101, name: "Dryer CLD-01", type: "dryer" }
  ]
};

export default function MachinesAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedShop = location.state;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const [selectedDate, setSelectedDate] = useState(() => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (selectedShop?.name) {
      const shopKey = Object.keys(shopMachines).find(key => selectedShop.name.includes(key)) || "QuickClean Laundry";
      setMachines(shopMachines[shopKey]);
      if (shopMachines[shopKey].length > 0) {
        setSelectedMachine(shopMachines[shopKey][0]);
      }
    }
  }, [selectedShop]);

  const handleDateSelect = (day) => {
    const year = currentYear;
    const month = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${dayStr}`);
  };

  const handleContinue = () => {
    if (!selectedMachine) {
      alert("Please select a machine");
      return;
    }
    navigate("/weight", {
      state: {
        shop: selectedShop,
        machine: selectedMachine,
        date: selectedDate
      }
    });
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({
      day,
      dateString,
      isCurrentMonth: true,
      isToday: day === currentDay,
      isPast: day < currentDay,
      isSelected: selectedDate === dateString
    });
  }

  const formatSelectedDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="screen">
      <div className="process-header">
        <button className="back-button-professional" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-info">
          <h2>Select Date & Machine</h2>
          <p className="subtitle">{selectedShop?.name || "Laundry Center"}</p>
        </div>
      </div>

      <div className="flow-container">
        {/* Date Selection Card */}
        <div className="selection-card">
          <div className="card-header">
            <FaCalendarAlt className="header-icon" />
            <h3>Choose Date</h3>
          </div>

          <div className="calendar-styled">
            <div className="calendar-month-year">
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="calendar-days-grid">
              {calendarDays.map((d, i) => (
                <div
                  key={i}
                  className={`cal-day ${!d.isCurrentMonth ? 'empty' : ''} ${d.isToday ? 'today' : ''} ${d.isSelected ? 'selected' : ''} ${d.isPast ? 'disabled' : ''}`}
                  onClick={() => d.isCurrentMonth && !d.isPast && handleDateSelect(d.day)}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
          <p className="selection-preview">Selected: <strong>{formatSelectedDate(selectedDate)}</strong></p>
        </div>

        {/* Machine Selection Card */}
        <div className="selection-card">
          <div className="card-header">
            <FaCogs className="header-icon" />
            <h3>Select Machine or Dryer</h3>
          </div>

          <div className="machine-flex-grid">
            {machines.map((m) => (
              <div
                key={m.id}
                className={`item-select-card ${selectedMachine?.id === m.id ? 'active' : ''}`}
                onClick={() => setSelectedMachine(m)}
              >
                <div className="item-icon">
                  {m.type === "washer" ? "🧼" : "💨"}
                </div>
                <div className="item-details">
                  <span className="item-name">{m.name}</span>
                  <span className="item-type">{m.type === "washer" ? "Washer" : "Dryer"}</span>
                </div>
                <div className="check-mark">{selectedMachine?.id === m.id ? "✓" : ""}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky-action-bar">
        <div className="selection-summary">
          <p><span>Shop:</span> {selectedShop?.name}</p>
          <p><span>Machine:</span> {selectedMachine?.name}</p>
        </div>
        <button className="continue-btn-pro" onClick={handleContinue}>
          Continue to Weight Selection →
        </button>
      </div>
    </div>
  );
}
