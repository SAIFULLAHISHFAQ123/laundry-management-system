import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMoneyBill, FaSave } from "react-icons/fa";

export default function UpdatePrice() {
    const navigate = useNavigate();
    const [prices, setPrices] = useState([
        { id: 1, item: "Basic Washing (40 min slot base price)", price: 500, type: "service" },
        { id: 2, item: "Drying (30 min)", price: 300, type: "service" },
        { id: 3, item: "Surf Excel", price: 50, type: "detergent" },
        { id: 4, item: "Ariel", price: 60, type: "detergent" },
    ]);

    const handlePriceChange = (id, newPrice) => {
        setPrices(prices.map(p => p.id === id ? { ...p, price: newPrice } : p));
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Pricing updated successfully!");
        navigate("/admin");
    };

    return (
        <div className="admin-screen screen">
            <div className="process-header">
                <button className="back-button-professional" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h2>Update Pricing</h2>
                    <p className="subtitle">Manage prices for machines and detergents.</p>
                </div>
            </div>

            <div className="flow-container">
                <div className="selection-card">
                    <div className="card-header">
                        <FaMoneyBill className="header-icon" />
                        <h3>Current Pricing Config</h3>
                    </div>
                    <form className="admin-form" onSubmit={handleSave}>
                        {prices.map((item) => (
                            <div className="form-group price-update-group" key={item.id}>
                                <div className="price-item-info">
                                    <span className="item-name">{item.item}</span>
                                    <span className="item-type">{item.type}</span>
                                </div>
                                <div className="price-input-wrapper">
                                    <span className="currency">PKR</span>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        ))}

                        <button type="submit" className="primary-btn-pro" style={{ marginTop: '2rem', width: '100%' }}>
                            <FaSave style={{ marginRight: '8px' }} /> Save Global Pricing
                        </button>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .price-update-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0 !important;
        }
        .price-update-group:last-of-type {
          border-bottom: none;
        }
        .price-item-info {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-weight: 600;
          color: var(--text-main);
        }
        .item-type {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
        }
        .price-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .price-input-wrapper input {
          width: 80px;
          padding: 0.5rem;
          border: none !important;
          border-radius: 4px;
          text-align: right;
          font-weight: 700;
          color: var(--text-main);
        }
        .currency {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        `
            }} />
        </div>
    );
}
