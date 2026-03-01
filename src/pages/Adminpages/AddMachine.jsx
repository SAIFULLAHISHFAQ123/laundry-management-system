import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTshirt, FaSave } from "react-icons/fa";

export default function AddMachine() {
    const navigate = useNavigate();
    const [machineData, setMachineData] = useState({
        name: "",
        type: "washer",
        capacity: "6"
    });

    const handleChange = (e) => {
        setMachineData({ ...machineData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Machine added successfully!");
        navigate("/admin");
    };

    return (
        <div className="admin-screen screen">
            <div className="process-header">
                <button className="back-button-professional" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h2>Add Machine</h2>
                    <p className="subtitle">Register a new washing machine or dryer.</p>
                </div>
            </div>

            <div className="flow-container">
                <div className="selection-card">
                    <div className="card-header">
                        <FaTshirt className="header-icon" />
                        <h3>Machine Details</h3>
                    </div>
                    <form className="admin-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Machine Name / ID</label>
                            <input type="text" name="name" value={machineData.name} onChange={handleChange} placeholder="e.g. Washer C-04" required />
                        </div>
                        <div className="form-group">
                            <label>Machine Type</label>
                            <select name="type" value={machineData.type} onChange={handleChange}>
                                <option value="washer">Washing Machine</option>
                                <option value="dryer">Dryer</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Capacity (KG)</label>
                            <select name="capacity" value={machineData.capacity} onChange={handleChange}>
                                <option value="6">6 KG</option>
                                <option value="8">8 KG</option>
                                <option value="12">12 KG</option>
                                <option value="15">15 KG</option>
                            </select>
                        </div>
                        <button type="submit" className="primary-btn-pro" style={{ marginTop: '1rem', width: '100%' }}>
                            <FaSave style={{ marginRight: '8px' }} /> Save Machine
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
