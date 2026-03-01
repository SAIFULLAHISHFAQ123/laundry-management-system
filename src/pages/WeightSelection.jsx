import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaScaleBalanced } from "react-icons/fa6";

export default function WeightSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const { shop, machine, date } = location.state || {};

  const weightOptions = [
    { value: 2, label: "2 kg", icon: "👜", load: "Light" },
    { value: 4, label: "4 kg", icon: "🧺", load: "Medium" },
    { value: 6, label: "6 kg", icon: "👕", load: "Standard" },
    { value: 8, label: "8 kg", icon: "🏋️", load: "Heavy" },
    { value: 10, label: "10 kg", icon: "🚚", load: "Max" }
  ];

  const [selectedWeight, setSelectedWeight] = useState(4);

  const handleContinue = () => {
    if (!selectedWeight) {
      alert("Please select a weight");
      return;
    }
    navigate("/cloth-type", {
      state: { shop, machine, date, selectedWeight }
    });
  };

  return (
    <div className="screen">
      <div className="process-header">
        <button className="back-button-professional" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-info">
          <h2>Select Load Weight</h2>
          <p className="subtitle">Estimate your laundry weight.</p>
        </div>
      </div>

      <div className="flow-container">
        <div className="selection-card">
          <div className="card-header">
            <FaScaleBalanced className="header-icon" />
            <h3>Choose Weight</h3>
          </div>

          <div className="weight-options-pro">
            {weightOptions.map((opt) => (
              <div
                key={opt.value}
                className={`weight-item-pro ${selectedWeight === opt.value ? 'active' : ''}`}
                onClick={() => setSelectedWeight(opt.value)}
              >
                <div className="opt-icon">{opt.icon}</div>
                <div className="opt-text">
                  <span className="weight-label">{opt.label}</span>
                  <span className="load-desc">{opt.load} Load</span>
                </div>
                <div className="radio-circle"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="tip-box">
          <p>💡 <strong>Tip:</strong> A standard wash load is typically between 5kg and 7kg.</p>
        </div>
      </div>

      <div className="sticky-action-bar">
        <div className="selection-summary">
          <p><span>Machine:</span> {machine?.name}</p>
          <p><span>Est. Weight:</span> {selectedWeight} kg</p>
        </div>
        <button className="continue-btn-pro" onClick={handleContinue}>
          Continue to Cloth Type →
        </button>
      </div>
    </div>
  );
}
