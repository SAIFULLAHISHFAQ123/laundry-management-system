import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ lat, lng, setLatLng }) {
    useMapEvents({
        click(e) {
            setLatLng(e.latlng.lat, e.latlng.lng);
        },
    });

    return lat && lng ? (
        <Marker position={[lat, lng]} />
    ) : null;
}

export default function AddLaundry() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        city: 'Islamabad',
        address: '',
        contact: '',
        lat: 33.6844,
        lng: 73.0479,
        openTime: '08:00',
        closeTime: '21:00',
        status: 'Available'
    });

    useEffect(() => {

        if (isEdit) {
            fetchLaundry();
        }

    }, []);

    const fetchLaundry = async () => {

        try {

            const res = await fetch(
                `https://localhost:7208/api/Laundry/${id}`
            );

            const data = await res.json();

            setFormData({
                name: data.name,
                city: data.city,
                address: data.address,
                contact: data.contactNumber,
                lat: data.latitude,
                lng: data.longitude,
                openTime: data.openTime,
                closeTime: data.closeTime,
                status: data.status || 'Available'
            });

        } catch (error) {

            console.log(error);

        }
    };

    const setLatLng = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            lat,
            lng
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const laundryData = {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            contactNumber: formData.contact,
            latitude: parseFloat(formData.lat),
            longitude: parseFloat(formData.lng),
            openTime: formData.openTime,
            closeTime: formData.closeTime,
            status: formData.status
        };

        try {

            let res;

            if (isEdit) {

                res = await fetch(
                    `https://localhost:7208/api/Laundry/${id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(laundryData)
                    }
                );

            } else {

                res = await fetch(
                    'https://localhost:7208/api/Laundry',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(laundryData)
                    }
                );

            }

            if (!res.ok) {
                throw new Error('Failed');
            }

            alert(
                isEdit
                    ? 'Laundry updated successfully ✅'
                    : 'Laundry added successfully ✅'
            );

            navigate('/admin/branch-overview');

        } catch (error) {

            console.log(error);

            alert('Something went wrong ❌');
        }
    };

    return (
        <div className="admin-container" style={{ maxWidth: '900px' }}>
            <div className="admin-card animate-in">
                <header style={{ marginBottom: '2.5rem' }}>
                    <h2 className="admin-page-title" style={{ fontSize: '1.8rem' }}>
                        {isEdit ? '🏢 Update Laundry Branch' : '🏢 Register New Branch'}
                    </h2>
                    <p className="text-muted">Enter branch details and pick its exact geolocation on the map.</p>
                </header>

                <form onSubmit={handleSubmit} className="flex-column gap-6">
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Branch Name</label>
                            <input
                                className="input-control"
                                type="text"
                                placeholder="e.g. Blue Lagoon Laundry"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <select
                                className="input-control"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            >
                                <option>Islamabad</option>
                                <option>Rawalpindi</option>
                                <option>Lahore</option>
                                <option>Karachi</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Physical Address</label>
                        <input
                            className="input-control"
                            type="text"
                            placeholder="Street, Block, Area..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                className="input-control"
                                type="text"
                                placeholder="e.g. +92 300 1234567"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Location Coordinates</label>
                            <div className="input-control" style={{ backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                📍 {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Geotag Branch Location</label>
                        <div style={{ height: '350px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--border)', marginTop: '0.5rem' }}>
                            <MapContainer center={[formData.lat, formData.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationPicker lat={formData.lat} lng={formData.lng} setLatLng={setLatLng} />
                            </MapContainer>
                        </div>
                        <small className="text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>💡 Click anywhere on the map to set the branch location.</small>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Opening Time</label>
                            <input
                                className="input-control"
                                type="time"
                                value={formData.openTime}
                                onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Closing Time</label>
                            <input
                                className="input-control"
                                type="time"
                                value={formData.closeTime}
                                onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Operational Status</label>
                        <select
                            className="input-control"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            style={{ 
                                color: formData.status === 'Busy' ? 'var(--danger)' : 'var(--success)',
                                fontWeight: 'bold'
                            }}
                        >
                            <option value="Available">Available (Green on Map)</option>
                            <option value="Busy">Busy / Temporarily Closed (Red on Map)</option>
                        </select>
                        <small className="text-muted">Setting to 'Busy' will manually turn the map marker red for all users.</small>
                    </div>

                    <div className="flex-between gap-4" style={{ marginTop: '2rem' }}>
                        <button type="button" className="btn btn-outline w-full" onClick={() => navigate('/admin/branch-overview')}>Cancel</button>
                        <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem' }}>
                            {isEdit ? 'Update Branch Details 🚀' : 'Register Branch 🚀'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}