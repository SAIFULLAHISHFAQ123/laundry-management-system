import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFlask, FaSave } from "react-icons/fa";

export default function AddDetergent() {
    const navigate = useNavigate();
    const [detergentData, setDetergentData] = useState({
        name: "",
        description: "",
        price: "0",
        stock: "100"
    });

    const handleChange = (e) => {
        setDetergentData({ ...detergentData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Detergent added successfully!");
        navigate("/admin");
    };

    return (
        <div className="admin-screen screen">
            <div className="process-header">
                <button className="back-button-professional" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h2>Add Detergent</h2>
                    <p className="subtitle">Register new washing items and prices.</p>
                </div>
            </div>

            <div className="flow-container">
                <div className="selection-card">
                    <div className="card-header">
                        <FaFlask className="header-icon" />
                        <h3>Detergent Details</h3>
                    </div>
                    <form className="admin-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Detergent Name</label>
                            <input type="text" name="name" value={detergentData.name} onChange={handleChange} placeholder="e.g. Ariel Matic" required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" name="description" value={detergentData.description} onChange={handleChange} placeholder="Features and usage..." required />
                        </div>
                        <div className="form-group">
                            <label>Additional Price (PKR)</label>
                            <input type="number" name="price" value={detergentData.price} onChange={handleChange} placeholder="e.g. 50" required min="0" />
                        </div>
                        <div className="form-group">
                            <label>Initial Stock (Units)</label>
                            <input type="number" name="stock" value={detergentData.stock} onChange={handleChange} placeholder="100" required min="1" />
                        </div>
                        <button type="submit" className="primary-btn-pro" style={{ marginTop: '1rem', width: '100%' }}>
                            <FaSave style={{ marginRight: '8px' }} /> Save Detergent
                        </button>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .admin-form .form-group {
          margin-bottom: 1.25rem;
        }
        .admin-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.875rem;
        }
        .admin-form input, .admin-form select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
          background-color: white;
        }
        .admin-form input:focus, .admin-form select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        `
            }} />
        </div>
    );
}
