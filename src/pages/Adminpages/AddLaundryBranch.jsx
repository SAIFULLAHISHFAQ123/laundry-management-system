import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStore, FaSave } from "react-icons/fa";

export default function AddLaundryBranch() {
    const navigate = useNavigate();
    const [branchData, setBranchData] = useState({
        name: "",
        address: "",
        hours: "",
        contact: ""
    });

    const handleChange = (e) => {
        setBranchData({ ...branchData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Branch added successfully!");
        navigate("/admin");
    };

    return (
        <div className="admin-screen screen">
            <div className="process-header">
                <button className="back-button-professional" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h2>Add Branch</h2>
                    <p className="subtitle">Register a new laundry branch location.</p>
                </div>
            </div>

            <div className="flow-container">
                <div className="selection-card">
                    <div className="card-header">
                        <FaStore className="header-icon" />
                        <h3>Branch Details</h3>
                    </div>
                    <form className="admin-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Branch Name</label>
                            <input type="text" name="name" value={branchData.name} onChange={handleChange} placeholder="e.g. Sparkle Wash G-9" required />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" value={branchData.address} onChange={handleChange} placeholder="Full address" required />
                        </div>
                        <div className="form-group">
                            <label>Operating Hours</label>
                            <input type="text" name="hours" value={branchData.hours} onChange={handleChange} placeholder="e.g. 7 AM - 11 PM" required />
                        </div>
                        <div className="form-group">
                            <label>Contact Phone</label>
                            <input type="tel" name="contact" value={branchData.contact} onChange={handleChange} placeholder="Phone number" required />
                        </div>
                        <button type="submit" className="primary-btn-pro" style={{ marginTop: '1rem', width: '100%' }}>
                            <FaSave style={{ marginRight: '8px' }} /> Save Branch
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
