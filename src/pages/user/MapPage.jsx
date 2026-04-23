import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { getBranches, haversineDistance } from '../../services/MapService';

// Import CSS
import 'leaflet/dist/leaflet.css';
import '../../styles/user.css';

/**
 * Custom Marker Icon Factory
 */
const createCustomIcon = (status, isSelected) => {
    // Green = Available, Red = Busy, Orange = Free in 10 mins
    const color = status === 'Green' ? '#10b981' : status === 'Red' ? '#ef4444' : '#f59e0b';
    const scale = isSelected ? 1.4 : 1;
    
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: ${30 * scale}px;
                height: ${30 * scale}px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            ">
                <div style="
                    width: ${10 * scale}px;
                    height: ${10 * scale}px;
                    background-color: white;
                    border-radius: 50%;
                    transform: rotate(45deg);
                "></div>
            </div>
        `,
        iconSize: [30 * scale, 30 * scale],
        iconAnchor: [15 * scale, 30 * scale],
        popupAnchor: [0, -30 * scale]
    });
};

/**
 * Recenter Map on Location Changes
 */
function MapRecenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

export default function MapPage() {
    const navigate = useNavigate();
    const { updateBooking } = useBooking();
    
    // Core State
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [userLoc, setUserLoc] = useState([33.6844, 73.0479]); // Islamabad default
    
    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filters
    const [radius, setRadius] = useState(10);
    const [machineType, setMachineType] = useState('Both');
    const [minRating, setMinRating] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Initialize Branches
    useEffect(() => {
        const data = getBranches();
        setBranches(data);
        setFilteredBranches(data);
    }, []);

    // Filter Logic
    useEffect(() => {
        let results = branches;

        // 1. Search Filter
        if (searchTerm) {
            results = results.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // 2. Radius Filter
        results = results.filter(b => {
             if (!b.position || !Array.isArray(b.position)) return false; 
             return haversineDistance(userLoc, b.position) <= radius;
        });

        // 3. Machine Type Filter
        if (machineType !== 'Both') {
            results = results.filter(b => (machineType === 'Washer' ? b.machines.available.washer > 0 : b.machines.available.dryer > 0));
        }

        // 4. Rating Filter
        results = results.filter(b => b.rating >= minRating);

        setFilteredBranches(results);
    }, [radius, machineType, minRating, branches, userLoc, searchTerm, selectedDate]);

    // Handlers
    const handleLocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setUserLoc([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    };

    const handleResetFilters = () => {
        setRadius(10);
        setMachineType('Both');
        setMinRating(0);
        setSearchTerm('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const handleBookNow = (branch) => {
        const distance = haversineDistance(userLoc, branch.position);
        const travelTime = Math.round((distance / 30) * 60); // minutes at 30km/h

        if (branch.status === 'Red') {
            const confirmQueue = window.confirm(`This laundry is currently busy. Estimated travel time is ${travelTime} mins. A slot is expected to be free around that time. Would you like to join the queue? \n\nNote: You must arrive within ${travelTime + 5} mins or your slot will go to the next person.`);
            
            if (confirmQueue) {
                updateBooking('branch', branch);
                updateBooking('selectedDate', selectedDate);
                updateBooking('isQueued', true);
                updateBooking('estimatedArrival', travelTime);
                alert("You've been added to the queue! Proceed to select your slots.");
                navigate('/machine-date');
            }
            return;
        }

        updateBooking('branch', branch);
        updateBooking('selectedDate', selectedDate); // Save date choice
        updateBooking('isQueued', false);
        navigate('/machine-date');
    };

    const getTravelInfo = (branch) => {
        const dist = haversineDistance(userLoc, branch.position);
        const time = Math.round((dist / 30) * 60);
        return { distance: dist.toFixed(1), time };
    };

    return (
        <div className="user-page-container">
            
            {/* Top Search & Filter Bar */}
            <div className="map-search-container">
                <div className="search-input-wrapper">
                    <span style={{ marginRight: '0.75rem' }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search laundry centers..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`filter-toggle-btn ${isSidebarOpen ? 'active' : ''}`}
                    title="Filters"
                >
                    ⚙️
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <aside className="map-sidebar">
                    <div className="sidebar-header">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Smart Filters</h2>
                        <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                    </div>

                    <div className="filter-group mb-8">
                        <label className="text-muted" style={{ display: 'block', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Booking Date</label>
                        <input 
                            type="date" 
                            className="input-control"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-group mb-8">
                        <label className="text-muted" style={{ display: 'block', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Radius: {radius}km</label>
                        <input type="range" min="1" max="50" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                    </div>

                    <div className="filter-group mb-8">
                        <label className="text-muted" style={{ display: 'block', fontWeight: '700', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Machine Type</label>
                        <div className="flex-column gap-2">
                            {['Washer', 'Dryer', 'Both'].map(type => (
                                <label 
                                    key={type} 
                                    className={`filter-option-card ${machineType === type ? 'selected' : ''}`}
                                    onClick={() => setMachineType(type)}
                                >
                                    <input type="radio" name="mt" checked={machineType === type} readOnly style={{ accentColor: 'var(--primary)' }} />
                                    <span style={{ fontWeight: '600' }}>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group mb-8">
                        <label className="text-muted" style={{ display: 'block', fontWeight: '700', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Min Rating: {minRating}★</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                    key={star} 
                                    onClick={() => setMinRating(star)}
                                    style={{ cursor: 'pointer', fontSize: '1.5rem', color: star <= minRating ? '#f59e0b' : '#d1d5db', transition: 'all 0.2s' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex-column gap-4">
                        <button className="btn btn-primary w-full" onClick={handleLocate}>🎯 Update My Location</button>
                        <button className="btn btn-outline w-full" style={{ color: 'var(--danger)', borderColor: 'var(--border)' }} onClick={handleResetFilters}>🗑️ Reset All</button>
                    </div>
                </aside>
            )}

            {/* Map Area */}
            <main style={{ height: '100%', width: '100%', position: 'relative' }}>
                <MapContainer center={userLoc} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapRecenter center={userLoc} />
                    
                    {/* User Location Marker */}
                    <Marker position={userLoc} icon={L.divIcon({
                        className: 'user-marker',
                        html: `
                            <div class="user-pulse-container">
                                <div class="user-pulse"></div>
                                <div class="user-dot"></div>
                            </div>
                        `,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    })}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong>You are here</strong>
                                <p style={{ margin: '5px 0 0', fontSize: '0.8rem' }}>Searching within {radius}km</p>
                            </div>
                        </Popup>
                    </Marker>
                    
                    {filteredBranches.map(branch => (
                        <Marker 
                            key={branch.id} 
                            position={branch.position} 
                            icon={createCustomIcon(branch.status, selectedBranch?.id === branch.id)}
                            eventHandlers={{ click: () => setSelectedBranch(branch) }}
                        >
                            <Popup>
                                <div style={{ minWidth: '220px', padding: '5px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>{branch.name}</h4>
                                    <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {branch.address}</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>📞 {branch.contact || 'N/A'}</p>
                                    
                                    <div style={{ display: 'flex', gap: '0.5rem', margin: '10px 0' }}>
                                        <span className="badge badge-warning" style={{ backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>⭐ {branch.rating}</span>
                                        <span className="badge badge-success" style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }}>PKR {branch.basePrice}</span>
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                                            <span>Washers:</span>
                                            <span style={{ fontWeight: 'bold' }}>{branch.machines.available.washer} Avail.</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span>Dryers:</span>
                                            <span style={{ fontWeight: 'bold' }}>{branch.machines.available.dryer} Avail.</span>
                                        </div>
                                    </div>

                                    <button 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        onClick={() => handleBookNow(branch)}
                                    >
                                        Select Laundry
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Legend Overlay */}
                <div className="map-legend animate-in">
                    <label className="text-muted" style={{ display: 'block', fontWeight: '800', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Live Occupancy</label>
                    <div className="flex-column gap-4">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.85rem', fontWeight: '600' }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                            <span>Available Now</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.85rem', fontWeight: '600' }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }}></span>
                            <span>Queue: ~10 Mins</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.85rem', fontWeight: '600' }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }}></span>
                            <span>Currently Full</span>
                        </div>
                    </div>
                </div>

                {/* Selected Branch Detail Area */}
                {selectedBranch && (
                    <div className="selected-branch-card animate-in">
                        <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }} onClick={() => setSelectedBranch(null)}>✕</button>
                        <h3 className="title-primary" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{selectedBranch.name}</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>📍 {selectedBranch.address}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="machine-pill washer-pill">
                                <small style={{ display: 'block', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Available Washers</small>
                                <strong style={{ fontSize: '1.1rem' }}>{selectedBranch.machines.available.washer} Units</strong>
                            </div>
                            <div className="machine-pill dryer-pill">
                                <small style={{ display: 'block', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Available Dryers</small>
                                <strong style={{ fontSize: '1.1rem' }}>{selectedBranch.machines.available.dryer} Units</strong>
                            </div>
                        </div>

                        {/* Travel Info Section */}
                        <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>DISTANCE</span>
                                <strong style={{ fontSize: '1.1rem' }}>{getTravelInfo(selectedBranch).distance} km</strong>
                            </div>
                            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--primary)', opacity: 0.2 }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>TRAVEL TIME</span>
                                <strong style={{ fontSize: '1.1rem' }}>{getTravelInfo(selectedBranch).time} mins</strong>
                            </div>
                        </div>

                        <div className="flex-between">
                            <div>
                                <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)' }}>PKR {selectedBranch.basePrice}</span>
                                <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '4px' }}>Base</span>
                            </div>
                            <button 
                                className={`btn ${selectedBranch.status === 'Red' ? 'btn-outline' : 'btn-primary'}`} 
                                onClick={() => handleBookNow(selectedBranch)}
                                style={selectedBranch.status === 'Red' ? { color: 'var(--danger)', borderColor: 'var(--danger)' } : {}}
                            >
                                {selectedBranch.status === 'Red' ? 'Join Queue' : 'Reserve Space →'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
