// BookingSuccess.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Bookingsuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {};

  const [bookingId, setBookingId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Generate booking and payment IDs
    setBookingId("BK" + Math.floor(Math.random() * 10000));
    setPaymentId("PAY" + Math.floor(Math.random() * 1000000));

    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleViewBookings = () => {
    navigate("/my-bookings");
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) {
      const today = new Date();
      return today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeStr) => {
    return timeStr || "10:00 AM";
  };

  return (
    <div className="booking-success-wrapper">
      {/* Success Animation & Header */}
      <div className="success-header-sky">
        <div className="success-animation-container">
          <div className="success-circle-large">
            <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <div className="success-text-container">
            <h1>Booking Confirmed!</h1>
            <p className="success-subtitle">Your laundry service has been successfully booked</p>
          </div>
        </div>
      </div>

      <div className="success-content-sky">
        {/* Main Content Grid */}
        <div className="success-grid-sky">
          {/* Left Column - Booking Details */}
          <div className="booking-details-card">
            <div className="card-title-sky">
              <span className="title-icon">📋</span>
              <h2>Booking Details</h2>
              <span className="status-badge-sky">Confirmed</span>
            </div>

            <div className="details-list-sky">
              {/* Booking ID & Payment ID */}
              <div className="detail-row highlight">
                <div className="detail-item">
                  <span className="detail-label">Booking ID</span>
                  <span className="detail-value id">{bookingId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment ID</span>
                  <span className="detail-value id">{paymentId}</span>
                </div>
              </div>

              <div className="divider-sky"></div>

              {/* Shop Information */}
              <div className="detail-row">
                <div className="detail-icon">🏪</div>
                <div className="detail-content">
                  <span className="detail-label">Laundry Shop</span>
                  <span className="detail-value shop-name">{bookingData.shop?.name || "Sparkle Wash"}</span>
                  <span className="detail-subvalue">{bookingData.shop?.address || "6th Road, Rawalpindi"}</span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="detail-row">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <span className="detail-label">Date & Time</span>
                  <span className="detail-value">
                    {formatDate(bookingData.date)} • {formatTime(bookingData.time)}
                  </span>
                  <span className="detail-subvalue duration">{bookingData.selectedClothType?.spinTime || "40 min"} service time</span>
                </div>
              </div>

              {/* Machine & Service */}
              <div className="detail-row">
                <div className="detail-icon">🧺</div>
                <div className="detail-content">
                  <span className="detail-label">Machine & Service</span>
                  <span className="detail-value">
                    {bookingData.machine?.name || "Washer C-01"} • {bookingData.selectedWeight || 6}kg
                  </span>
                  <span className="detail-subvalue">
                    {bookingData.selectedClothType?.name || "Cotton/Normal"} • {bookingData.selectedDetergent?.name || "Standard Detergent"}
                  </span>
                </div>
              </div>

              {/* Detergent Selection */}
              {bookingData.selectedDetergent && bookingData.selectedDetergent.price > 0 && (
                <div className="detail-row">
                  <div className="detail-icon">➕</div>
                  <div className="detail-content">
                    <span className="detail-label">Additional Items</span>
                    <div className="addons-list-success">
                      <div className="addon-tag">
                        <span>Detergent </span>
                        <span>{bookingData.selectedDetergent.name}</span>
                        <span className="addon-price">PKR {bookingData.selectedDetergent.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup Method */}
              <div className="detail-row pickup-row">
                <div className="detail-icon">🚶</div>
                <div className="detail-content">
                  <span className="detail-label">Pickup Method</span>
                  <span className="pickup-badge-success">Self Pickup</span>
                  <span className="detail-subvalue">Pick up your laundry at the shop counter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary & Instructions */}
          <div className="payment-summary-card">
            {/* Payment Summary */}
            <div className="payment-summary-section">
              <div className="card-title-sky">
                <span className="title-icon">💰</span>
                <h2>Payment Summary</h2>
              </div>

              <div className="payment-amount-circle">
                <span className="amount-label-sky">Total Paid</span>
                <span className="amount-value-sky">PKR {bookingData.totalPrice || 500}</span>
                <span className="payment-method-sky">via Cash</span>
              </div>

              <div className="payment-breakdown-mini">
                <div className="breakdown-row">
                  <span>Base Service ({bookingData.selectedClothType?.spinTime || "40 min"})</span>
                  <span>PKR {(bookingData.totalPrice || 500) - (bookingData.selectedDetergent?.price || 0)}</span>
                </div>

                {bookingData.selectedDetergent && bookingData.selectedDetergent.price > 0 && (
                  <div className="breakdown-row addon">
                    <span>{bookingData.selectedDetergent.name}</span>
                    <span>PKR {bookingData.selectedDetergent.price}</span>
                  </div>
                )}

                <div className="breakdown-row free">
                  <span>Self Pickup</span>
                  <span className="free-text">Free</span>
                </div>

                <div className="divider-sky-light"></div>

                <div className="breakdown-row total">
                  <span>Total Amount</span>
                  <span className="total-success">PKR {bookingData.totalPrice || 500}</span>
                </div>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="pickup-instructions-card">
              <div className="instructions-header-sky">
                <span className="instructions-icon">📍</span>
                <h3>Pickup Instructions</h3>
              </div>

              <div className="instructions-content">
                <div className="instruction-step">
                  <div className="step-number">1</div>
                  <div className="step-text">
                    <strong>Visit the shop</strong>
                    <p>{bookingData.shop?.address || "6th Road, Rawalpindi"}</p>
                  </div>
                </div>

                <div className="instruction-step">
                  <div className="step-number">2</div>
                  <div className="step-text">
                    <strong>Show this confirmation</strong>
                    <p>Present your booking ID: <span className="booking-id-highlight">{bookingId}</span></p>
                  </div>
                </div>

                <div className="instruction-step">
                  <div className="step-number">3</div>
                  <div className="step-text">
                    <strong>Pay in cash</strong>
                    <p>Pay PKR {bookingData.totalPrice || 500} at the counter</p>
                  </div>
                </div>

                <div className="instruction-step">
                  <div className="step-number">4</div>
                  <div className="step-text">
                    <strong>Collect your laundry</strong>
                    <p>Your laundry will be ready in {bookingData.selectedClothType?.spinTime || "40 min"}</p>
                  </div>
                </div>
              </div>

              <div className="important-note">
                <span className="note-icon">⏰</span>
                <p>Please arrive 5 minutes before your scheduled time. Booking will be held for 15 minutes after the scheduled time.</p>
              </div>
            </div>

            {/* Shop Timing */}
            <div className="shop-timing-card">
              <div className="timing-icon">🕐</div>
              <div className="timing-info">
                <span className="timing-label">Shop Hours</span>
                <span className="timing-value">{bookingData.shop?.hours || "7 AM - 11 PM"}</span>
                <span className="timing-note">Open 7 days a week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions-sky">
          <button className="view-bookings-btn-sky" onClick={handleViewBookings}>
            <span className="btn-icon">📱</span>
            View My Bookings
          </button>

          <button className="home-btn-sky" onClick={handleBackToHome}>
            <span className="btn-icon">🏠</span>
            Back to Home
          </button>

          <button className="download-btn-sky" onClick={() => window.print()}>
            <span className="btn-icon">⬇️</span>
            Download Receipt
          </button>
        </div>

        {/* Auto Redirect Message */}
        <div className="redirect-message">
          <p>Redirecting to home in <span className="countdown">{countdown}</span> seconds...</p>
          <button className="cancel-redirect" onClick={() => setCountdown(0)}>
            Stay here
          </button>
        </div>
      </div>
    </div>
  );
}