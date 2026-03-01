import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTshirt, FaBaby, FaWeight, FaFlask } from "react-icons/fa";

export default function ClothTypeScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    shop,
    machine,
    date,
    selectedWeight
  } = location.state || {};

  const clothTypes = [
    { id: 1, name: "Cotton / Normal", description: "T-shirts, jeans, towels, bed sheets", icon: <FaTshirt />, spinTime: "40 min" },
    { id: 2, name: "Delicates", description: "Silk, lace, underwears, lingerie", icon: "👙", spinTime: "30 min" },
    { id: 3, name: "Woolens", description: "Sweaters, wool shirts, winter wear", icon: "🧥", spinTime: "40 min" },
    { id: 4, name: "White Clothes", description: "White shirts, bedsheets, whites", icon: "🥼", spinTime: "50 min" },
    { id: 5, name: "Heavy Duty", description: "Work clothes, heavily soiled items", icon: <FaWeight />, spinTime: "60 min" },
    { id: 6, name: "Baby Clothes", description: "Babywear, sensitive skin items", icon: <FaBaby />, spinTime: "50 min" }
  ];

  const detergentOptions = [
    { id: "own", name: "I'll bring my own", description: "Use my own detergent", icon: "🏠", price: 0 },
    { id: "surf", name: "Surf Excel", description: "Premium stain removal", icon: "✨", price: 50 },
    { id: "ariel", name: "Ariel", description: "Professional grade cleaning", icon: "⭐", price: 60 },
    { id: "bonus", name: "Bonus Advance", description: "Great value for money", icon: "🧴", price: 30 }
  ];

  const [selectedClothType, setSelectedClothType] = useState(null);
  const [selectedDetergent, setSelectedDetergent] = useState(detergentOptions[0]);

  const handleContinue = () => {
    if (!selectedClothType) {
      alert("Please select a cloth type");
      return;
    }

    navigate("/available-slots", {
      state: {
        shop,
        machine,
        date,
        selectedWeight,
        selectedClothType,
        selectedDetergent
      }
    });
  };

  return (
    <div className="screen">
      <div className="process-header">
        <button className="back-button-professional" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-info">
          <h2>Cloth & Detergent</h2>
          <p className="subtitle">Almost there! Choose your preferences.</p>
        </div>
      </div>

      <div className="flow-container">
        {/* Cloth Type Card */}
        <div className="selection-card">
          <div className="card-header">
            <FaTshirt className="header-icon" />
            <h3>Select Fabric Type</h3>
          </div>
          <div className="items-grid-compact">
            {clothTypes.map((type) => (
              <div
                key={type.id}
                className={`item-select-card-flat ${selectedClothType?.id === type.id ? 'active' : ''}`}
                onClick={() => setSelectedClothType(type)}
              >
                <div className="item-icon-small">{type.icon}</div>
                <div className="item-info-flat">
                  <span className="item-title">{type.name}</span>
                  <span className="item-subtitle">{type.spinTime} cycle</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detergent Card */}
        <div className="selection-card">
          <div className="card-header">
            <FaFlask className="header-icon" />
            <h3>Select Detergent</h3>
          </div>
          <div className="items-grid-compact">
            {detergentOptions.map((det) => (
              <div
                key={det.id}
                className={`item-select-card-flat ${selectedDetergent?.id === det.id ? 'active' : ''}`}
                onClick={() => setSelectedDetergent(det)}
              >
                <div className="item-icon-small">{det.icon}</div>
                <div className="item-info-flat">
                  <span className="item-title">{det.name}</span>
                  <span className="item-subtitle">{det.price > 0 ? `+PKR ${det.price}` : 'Free'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky-action-bar">
        <div className="selection-summary">
          <p><span>Fabric:</span> {selectedClothType?.name || 'None'}</p>
          <p><span>Detergent:</span> {selectedDetergent?.name}</p>
        </div>
        <button
          className={`continue-btn-pro ${!selectedClothType ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedClothType}
        >
          Check Available Slots →
        </button>
      </div>
    </div>
  );
}
