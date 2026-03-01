import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStore, FaClock, FaFlask, FaScaleBalanced, FaCheck, FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft, FaTshirt } from "react-icons/fa";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {};

  const [bookingDetails, setBookingDetails] = useState({
    shop: bookingData.shop || {
      name: "Sparkle Wash",
      address: "6th Road, RWP",
      hours: "7 AM - 11 PM",
      rating: 4.7
    },
    machine: bookingData.machine || {
      id: 3,
      name: "Washer C-01",
      type: "washer"
    },
    date: bookingData.date || "25 Feb 2026",
    time: bookingData.time || "10:00 AM",
    selectedWeight: bookingData.selectedWeight || 6,
    selectedClothType: bookingData.selectedClothType || {
      name: "Cotton/Normal",
      icon: "👕"
    },
    selectedDetergent: bookingData.selectedDetergent || {
      name: "Surf Excel",
      price: 50
    },
    totalPrice: bookingData.totalPrice || 550
  });

  const handleConfirmBooking = () => {
    navigate("/success", {
      state: {
        ...bookingDetails
      }
    });
  };

  return (
    <div className="screen booking-confirm-screen">
      <div className="process-header">
        <button className="back-button-professional" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-info">
          <h2>Booking Review</h2>
          <p className="subtitle">Verify your self-pickup laundry reservation.</p>
        </div>
      </div>

      <div className="flow-container">
        {/* Reservation Summary Card */}
        <div className="selection-card">
          <div className="card-header">
            <FaCheck className="header-icon" />
            <h3>Order Details</h3>
          </div>

          <div className="confirmation-grid">
            <div className="confirm-item">
              <FaStore className="confirm-icon" />
              <div className="confirm-content">
                <span className="confirm-label">Laundry Center</span>
                <span className="confirm-value">{bookingDetails.shop.name}</span>
                <span className="confirm-subvalue">{bookingDetails.shop.address}</span>
              </div>
            </div>

            <div className="confirm-item">
              <FaClock className="confirm-icon" />
              <div className="confirm-content">
                <span className="confirm-label">Scheduled For</span>
                <span className="confirm-value">{bookingDetails.date}</span>
                <span className="confirm-subvalue">at {bookingDetails.time}</span>
              </div>
            </div>

            <div className="confirm-item">
              <FaTshirt className="confirm-icon" />
              <div className="confirm-content">
                <span className="confirm-label">Machine & Fabric</span>
                <span className="confirm-value">{bookingDetails.machine.name}</span>
                <span className="confirm-subvalue">{bookingDetails.selectedClothType.name}</span>
              </div>
            </div>

            <div className="confirm-item">
              <FaScaleBalanced className="confirm-icon" />
              <div className="confirm-content">
                <span className="confirm-label">Weight & Detergent</span>
                <span className="confirm-value">{bookingDetails.selectedWeight} kg Load</span>
                <span className="confirm-subvalue">{bookingDetails.selectedDetergent.name} detergent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="selection-card pricing-card">
          <div className="pricing-header">
            <h3>Price Summary</h3>
          </div>
          <div className="price-rows">
            <div className="price-row-flat">
              <span>Service Fee ({bookingDetails.selectedClothType.spinTime || '40 min'})</span>
              <span>PKR {bookingDetails.totalPrice - (bookingDetails.selectedDetergent?.price || 0)}</span>
            </div>
            <div className="price-row-flat">
              <span>Detergent Selection</span>
              <span>PKR {bookingDetails.selectedDetergent.price || 0}</span>
            </div>
            <div className="price-divider"></div>
            <div className="price-row-flat total">
              <span>Total Payable</span>
              <span className="total-value">PKR {bookingDetails.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="instruction-box">
          <p>📍 <strong>Self-Pickup Notice:</strong> Please bring your laundry items to the center at your scheduled time. Our staff will be ready to assist you with the selected machine.</p>
        </div>
      </div>

      <div className="sticky-action-bar">
        <div className="selection-summary">
          <p><span>Amount:</span> <strong>PKR {bookingDetails.totalPrice}</strong></p>
          <p className="mini-note">Self-Pickup service</p>
        </div>
        <button className="continue-btn-pro" onClick={handleConfirmBooking}>
          Confirm Reservation <FaArrowRight style={{ marginLeft: '8px' }} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .confirmation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin: 1rem 0;
        }
        .confirm-item {
          display: flex;
          gap: 1rem;
        }
        .confirm-icon {
          font-size: 1.25rem;
          color: var(--primary);
          margin-top: 0.25rem;
        }
        .confirm-content {
          display: flex;
          flex-direction: column;
        }
        .confirm-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .confirm-value {
          font-weight: 700;
          color: var(--text-main);
          font-size: 1rem;
        }
        .confirm-subvalue {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .price-rows {
          margin-top: 0.5rem;
        }
        .price-row-flat {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          font-weight: 500;
        }
        .price-row-flat.total {
          font-weight: 800;
          font-size: 1.25rem;
          padding-top: 1.25rem;
        }
        .price-divider {
          height: 1px;
          background: var(--border);
          margin: 0.5rem 0;
        }
        .instruction-box {
          background: #eff6ff;
          border-left: 4px solid var(--primary);
          padding: 1.25rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          color: #1e40af;
        }
        @media (max-width: 600px) {
          .confirmation-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}} />
    </div>
  );
}
