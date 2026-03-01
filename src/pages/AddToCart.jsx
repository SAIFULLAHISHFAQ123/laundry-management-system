import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCartShopping, FaCheck, FaArrowRight } from "react-icons/fa6";

export default function AddToCart() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    shop,
    machine,
    date,
    time,
    selectedWeight,
    selectedClothType,
    selectedDetergent,
    spinTime,
    totalPrice
  } = location.state || {};

  const handleCheckout = () => {
    navigate("/confirm", {
      state: {
        shop,
        machine,
        date,
        time,
        selectedWeight,
        selectedClothType,
        selectedDetergent,
        totalPrice
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
          <h2>Your Cart</h2>
          <p className="subtitle">Review your selection before checkout.</p>
        </div>
      </div>

      <div className="flow-container">
        <div className="selection-card">
          <div className="success-banner-pro">
            <div className="success-circle">
              <FaCheck />
            </div>
            <h3>Added to Cart!</h3>
          </div>

          <div className="cart-item-professional">
            <div className="cart-item-header">
              <FaCartShopping className="header-icon" />
              <h3>Laundry Reservation</h3>
            </div>

            <div className="cart-details-grid">
              <div className="cart-detail-box">
                <span className="label">Shop</span>
                <span className="value">{shop?.name}</span>
              </div>
              <div className="cart-detail-box">
                <span className="label">Machine</span>
                <span className="value">{machine?.name}</span>
              </div>
              <div className="cart-detail-box">
                <span className="label">Schedule</span>
                <span className="value">{date} • {time}</span>
              </div>
              <div className="cart-detail-box">
                <span className="label">Fabric</span>
                <span className="value">{selectedClothType?.name}</span>
              </div>
              <div className="cart-detail-box">
                <span className="label">Weight</span>
                <span className="value">{selectedWeight} kg</span>
              </div>
              <div className="cart-detail-box">
                <span className="label">Detergent</span>
                <span className="value">{selectedDetergent?.name}</span>
              </div>
              {spinTime && (
                <div className="cart-detail-box highlight">
                  <span className="label">Spin Duration</span>
                  <span className="value">{spinTime}</span>
                </div>
              )}
            </div>

            <div className="cart-price-footer">
              <span className="total-label">Subtotal</span>
              <span className="total-value">PKR {totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="cart-actions-new">
          <button className="secondary-btn-pro" onClick={() => navigate("/home")}>
            Book Another Machine
          </button>
          <button className="primary-btn-pro" onClick={handleCheckout}>
            Go to Checkout <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
