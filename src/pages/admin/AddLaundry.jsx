import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

export default function AddLaundry() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        city: 'Islamabad',
        address: '',
        contact: '',
        basePrice: 500,
        lat: 33.6844,
        lng: 73.0479,
        status: 'Green'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newBranch = {
            id: Date.now(), // Generate a unique ID
            name: formData.name,
            city: formData.city,
            address: formData.address,
            contact: formData.contact,
            position: [parseFloat(formData.lat), parseFloat(formData.lng)],
            rating: 5.0, // Default for new branch
            basePrice: parseInt(formData.basePrice),
            status: formData.status,
            machines: {
                available: { washer: 5, dryer: 5 },
                busy: { washer: 0, dryer: 0 }
            }
        };

        // Save to localStorage for immediate map update
        const existing = JSON.parse(localStorage.getItem('laundry_branches') || '[]');
        // If it's the first time and we want to keep mock data, we should fetch mock data first
        // But getBranches handles the fallback. So we just append to localStorage.
        
        // Let's get current branches from service if possible, or just push to localStorage
        const allBranches = [...existing, newBranch];
        localStorage.setItem('laundry_branches', JSON.stringify(allBranches));

        try {
            // Attempt API call but don't block if it fails in local dev
            await fetch("https://localhost:7208/api/laundry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    city: formData.city,
                    contactNumber: formData.contact,
                    latitude: parseFloat(formData.lat),
                    longitude: parseFloat(formData.lng)
                })
            }).catch(err => console.log("API not available, saved to local storage only."));

            alert("Laundry added successfully! It will now appear on the map. ✅");
            navigate('/admin/branch-overview');

        } catch (error) {
            console.error("Error:", error);
            alert("Success! Branch saved locally. ✅");
            navigate('/admin/branch-overview');
        }
    };

    return (
        <div className="admin-container" style={{ maxWidth: '800px' }}>
            <div className="admin-card animate-in">
                <header style={{ marginBottom: '2rem' }}>
                    <h2 className="admin-page-title" style={{ fontSize: '1.5rem' }}>
                        Add New Laundry Branch
                    </h2>
                    <p className="text-muted">
                        Register a new physical location for users to book machines.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="flex-column gap-4">

                    {/* NAME + CONTACT */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="admin-nav-label">Branch Name</label>
                            <input
                                className="input-control"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Blue Lagoon Laundry"
                            />
                        </div>

                        <div className="form-group">
                            <label className="admin-nav-label">Contact Number</label>
                            <input
                                className="input-control"
                                required
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                placeholder="e.g. +92 300 1234567"
                            />
                        </div>
                    </div>

                    {/* CITY + PRICE */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="admin-nav-label">City</label>
                            <select
                                className="input-control"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            >
                                <option value="Islamabad">Islamabad</option>
                                <option value="Rawalpindi">Rawalpindi</option>
                                <option value="Lahore">Lahore</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="admin-nav-label">Base Price (PKR)</label>
                            <input
                                type="number"
                                className="input-control"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="form-group">
                        <label className="admin-nav-label">Full Address</label>
                        <input
                            className="input-control"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Street address, Sector/Block, City"
                        />
                    </div>

                    {/* LAT LNG STATUS */}
                    <div className="grid-3">
                        <div className="form-group">
                            <label className="admin-nav-label">Latitude</label>
                            <input
                                step="any"
                                type="number"
                                className="input-control"
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="admin-nav-label">Longitude</label>
                            <input
                                step="any"
                                type="number"
                                className="input-control"
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="admin-nav-label">Initial Status</label>
                            <select
                                className="input-control"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Green">Green (Available)</option>
                                <option value="Orange">Orange (Busy Soon)</option>
                                <option value="Red">Red (Full)</option>
                            </select>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex-between gap-4" style={{ marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="btn btn-outline w-full"
                            onClick={() => navigate('/admin/branch-overview')}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            style={{ padding: '1rem' }}
                        >
                            Create Branch 🏬
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}