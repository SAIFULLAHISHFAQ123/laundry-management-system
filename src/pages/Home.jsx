import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

const Home = () => {
  const navigate = useNavigate();

  // Default location: Islamabad (centered to show wider area)
  const defaultLocation = { lat: 33.6500, lng: 73.0500 };

  // State management
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(15); // increased to 15km
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef(null);

  // Laundry shop data spread across Rawalpindi and Islamabad at various distances
  const laundryShops = [
    // Islamabad Shops (Sector F Series)
    {
      id: 1,
      name: 'QuickClean Laundry',
      address: 'F-10 Markaz, Islamabad',
      position: [33.7100, 73.0200], // F-10 area
      rating: 4.5,
      services: ['Wash & Fold', 'Dry Cleaning', 'Ironing'],
      hours: '8 AM - 10 PM',
      phone: '+92 300 1234567',
      status: 'free',
      basePrice: 180,
      currency: 'PKR',
      area: 'Islamabad'
    },
    {
      id: 2,
      name: 'Fresh & Clean',
      address: 'G-11 Markaz, Islamabad',
      position: [33.6800, 72.9900], // G-11 area
      rating: 4.2,
      services: ['Express Service', 'Steam Press'],
      hours: '9 AM - 9 PM',
      phone: '+92 300 7654321',
      status: 'soon',
      basePrice: 200,
      currency: 'PKR',
      area: 'Islamabad'
    },
    {
      id: 3,
      name: 'Sparkle Wash',
      address: 'E-11/2, Islamabad',
      position: [33.6950, 72.9700], // E-11 area
      rating: 4.7,
      services: ['Wash & Fold', 'Dry Cleaning', 'Carpet Cleaning'],
      hours: '7 AM - 11 PM',
      phone: '+92 300 9876543',
      status: 'free',
      basePrice: 220,
      currency: 'PKR',
      area: 'Islamabad'
    },
    {
      id: 4,
      name: 'White & Bright',
      address: 'F-7 Markaz, Islamabad',
      position: [33.7200, 73.0500], // F-7 area
      rating: 4.4,
      services: ['Premium Dry Clean', 'Alterations'],
      hours: '8 AM - 8 PM',
      phone: '+92 300 4567890',
      status: 'busy',
      basePrice: 250,
      currency: 'PKR',
      area: 'Islamabad'
    },
    {
      id: 5,
      name: 'Laundry Express',
      address: 'I-10 Markaz, Islamabad',
      position: [33.6650, 72.9600], // I-10 area
      rating: 4.0,
      services: ['Self Service', 'Drop-off'],
      hours: '24/7',
      phone: '+92 300 1122334',
      status: 'free',
      basePrice: 150,
      currency: 'PKR',
      area: 'Islamabad'
    },
    {
      id: 6,
      name: 'Premium Wash',
      address: 'F-11 Markaz, Islamabad',
      position: [33.7050, 72.9900], // F-11 area
      rating: 4.8,
      services: ['Luxury Service', 'Same Day'],
      hours: '8 AM - 9 PM',
      phone: '+92 300 5555666',
      status: 'soon',
      basePrice: 300,
      currency: 'PKR',
      area: 'Islamabad'
    },
    // Rawalpindi Shops
    {
      id: 7,
      name: 'City Laundry',
      address: 'Saddar, Rawalpindi',
      position: [33.6000, 73.0550], // Saddar area
      rating: 4.3,
      services: ['Wash & Fold', 'Dry Cleaning'],
      hours: '9 AM - 9 PM',
      phone: '+92 300 7777888',
      status: 'free',
      basePrice: 160,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 8,
      name: 'Royal Cleaners',
      address: 'Westridge, Rawalpindi',
      position: [33.5800, 73.0200], // Westridge area
      rating: 4.6,
      services: ['Premium Service', 'Wedding Dresses'],
      hours: '8 AM - 8 PM',
      phone: '+92 300 9999000',
      status: 'busy',
      basePrice: 280,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 9,
      name: 'Eco Wash',
      address: 'Chaklala Scheme 3, Rawalpindi',
      position: [33.5600, 73.0800], // Chaklala area
      rating: 4.4,
      services: ['Eco-Friendly', 'Wash & Fold'],
      hours: '10 AM - 8 PM',
      phone: '+92 300 4444555',
      status: 'free',
      basePrice: 190,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 10,
      name: 'Express Laundry',
      address: 'Gulraiz Colony, Rawalpindi',
      position: [33.6200, 73.0300], // Gulraiz area
      rating: 4.1,
      services: ['Express Service', 'Ironing'],
      hours: '8 AM - 10 PM',
      phone: '+92 300 6666777',
      status: 'soon',
      basePrice: 140,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 11,
      name: 'Modern Cleaners',
      address: 'Bahria Town Phase 4, Rawalpindi',
      position: [33.5400, 73.1200], // Bahria Town Phase 4
      rating: 4.9,
      services: ['Premium', 'Carpet Cleaning'],
      hours: '8 AM - 8 PM',
      phone: '+92 300 2222333',
      status: 'free',
      basePrice: 320,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 12,
      name: 'Wash & Go',
      address: 'DHA Phase 2, Islamabad',
      position: [33.5200, 73.1000], // DHA Phase 2
      rating: 4.7,
      services: ['Quick Wash', 'Fold'],
      hours: '7 AM - 11 PM',
      phone: '+92 300 8888999',
      status: 'busy',
      basePrice: 200,
      currency: 'PKR',
      area: 'Islamabad'
    },
    // Far away shops to show variety
    {
      id: 13,
      name: 'Luxury Laundry',
      address: 'Golf City, Rawalpindi',
      position: [33.4800, 73.1500], // Far south-east
      rating: 5.0,
      services: ['Ultra Premium', 'Pick & Drop'],
      hours: '9 AM - 9 PM',
      phone: '+92 300 1111222',
      status: 'soon',
      basePrice: 400,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 14,
      name: 'Quick Dry',
      address: 'Bani Gala, Islamabad',
      position: [33.7200, 73.1200], // Bani Gala area
      rating: 4.5,
      services: ['Express', 'Dry Clean'],
      hours: '9 AM - 9 PM',
      phone: '+92 300 3333444',
      status: 'free',
      basePrice: 220,
      currency: 'PKR',
      area: 'Islamabad'
    },
    {
      id: 15,
      name: 'Star Cleaners',
      address: 'G.T. Road, Rawalpindi',
      position: [33.6300, 73.0800], // Near airport
      rating: 4.2,
      services: ['Standard', 'Press Only'],
      hours: '8 AM - 10 PM',
      phone: '+92 300 5555667',
      status: 'busy',
      basePrice: 130,
      currency: 'PKR',
      area: 'Rawalpindi'
    },
    {
      id: 16,
      name: 'Rainbow Laundry',
      address: 'Kuri Road, Islamabad',
      position: [33.6800, 73.1100], // Kuri area
      rating: 4.6,
      services: ['Color Care', 'Dry Clean'],
      hours: '9 AM - 9 PM',
      phone: '+92 300 7777889',
      status: 'free',
      basePrice: 240,
      currency: 'PKR',
      area: 'Islamabad'
    }
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Custom marker creation based on status
  const createCustomMarker = (shop) => {
    const statusColors = {
      free: '#10b981', // green
      soon: '#fbbf24', // yellow
      busy: '#ef4444'  // red
    };

    const color = statusColors[shop.status] || '#6b7280';

    return L.divIcon({
      html: `
        <div class="custom-marker-wrapper">
          <div class="marker-pin" style="background-color: ${color}">
            <div class="marker-dot"></div>
          </div>
          <div class="marker-info-card">
            <div class="marker-rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span>${shop.rating}</span>
            </div>
            <div class="marker-price">${shop.basePrice} ${shop.currency}</div>
          </div>
        </div>
      `,
      className: 'custom-marker-container',
      iconSize: [40, 60],
      iconAnchor: [20, 60],
      popupAnchor: [0, -60]
    });
  };

  // User location marker
  const userIcon = L.divIcon({
    html: `
      <div class="user-marker-wrapper">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-dot"></div>
      </div>
    `,
    className: 'user-marker-container',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  // Filter shops based on search, distance, and rating
  const applyFilters = (shops, query, distance, rating, userLoc) => {
    let filtered = shops;

    // Search filter
    if (query.trim() !== '') {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.address.toLowerCase().includes(query.toLowerCase()) ||
        shop.services.some(service => service.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Distance filter
    if (userLoc && distance > 0) {
      filtered = filtered.filter(shop => {
        const dist = calculateDistance(
          userLoc.lat,
          userLoc.lng,
          shop.position[0],
          shop.position[1]
        );
        return dist <= distance;
      });
    }

    // Rating filter
    if (rating > 0) {
      filtered = filtered.filter(shop => shop.rating >= rating);
    }

    return filtered;
  };

  // Initialize
  useEffect(() => {
    const filtered = applyFilters(laundryShops, searchQuery, selectedDistance, selectedRating, userLocation);
    setFilteredShops(filtered);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          if (mapRef.current) {
            mapRef.current.flyTo([userPos.lat, userPos.lng], 11); // Zoomed out a bit more to show wider area
          }
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  // Update filters
  useEffect(() => {
    const filtered = applyFilters(laundryShops, searchQuery, selectedDistance, selectedRating, userLocation);
    setFilteredShops(filtered);
  }, [searchQuery, selectedDistance, selectedRating, userLocation]);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredShops.length > 0 && mapRef.current) {
      mapRef.current.flyTo(filteredShops[0].position, 14);
    }
  };

  // Handle filters
  const handleDistanceChange = (distance) => {
    setSelectedDistance(distance);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDistance(15);
    setSelectedRating(0);
  };

  // Map controls
  const handleFindMe = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 12);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          if (mapRef.current) {
            mapRef.current.flyTo([userPos.lat, userPos.lng], 12);
          }
        },
        (error) => {
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    }
  };

  const handleShowAll = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([33.6500, 73.0500], 10); // Zoom out to show all shops
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'free': return 'Available Now';
      case 'soon': return 'Free in 10 mins';
      case 'busy': return 'Busy';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'free': return '#10b981';
      case 'soon': return '#fbbf24';
      case 'busy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header-section">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2.01L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6v-9h12v9zm0-11H6V4h12v5z" />
                <circle cx="8" cy="6" r="1" />
                <circle cx="11" cy="6" r="1" />
                <path d="M12 19c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
              </svg>
            </div>
            <div>
              <h1 className="brand-title">LaundryPro</h1>
              <p className="brand-subtitle">Professional Laundry Services</p>
            </div>
          </div>

          <div className="location-display">
            <svg className="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="location-text">Rawalpindi & Islamabad</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Search and Filter Section */}
        <section className="search-filter-section">
          <div className="search-filter-container">
            {/* Search Bar */}
            <form className="search-bar-wrapper" onSubmit={handleSearchSubmit}>
              <div className="search-bar">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search laundry by name, location, or service..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Filter Button */}
            <button
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
              </svg>
              Filters
              {(selectedDistance < 15 || selectedRating > 0) && (
                <span className="filter-badge"></span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-content">
                {/* Distance Filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Distance (Nearest to me)
                  </label>
                  <div className="distance-options">
                    {[5, 10, 15, 20, 30].map(dist => (
                      <button
                        key={dist}
                        className={`distance-btn ${selectedDistance === dist ? 'active' : ''}`}
                        onClick={() => handleDistanceChange(dist)}
                        disabled={!userLocation}
                      >
                        {dist} km
                      </button>
                    ))}
                  </div>
                  {!userLocation && (
                    <p className="filter-note">Enable location to use distance filter</p>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    Minimum Rating
                  </label>
                  <div className="rating-options">
                    {[0, 3.5, 4.0, 4.5].map(rating => (
                      <button
                        key={rating}
                        className={`rating-btn ${selectedRating === rating ? 'active' : ''}`}
                        onClick={() => handleRatingChange(rating)}
                      >
                        {rating === 0 ? 'All' : `${rating}+ ★`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Status Legend */}
          <div className="status-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
              Available Now
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#fbbf24' }}></span>
              Free in 10 mins
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
              Busy
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#0ea5e9' }}></span>
              {laundryShops.length} Shops Total
            </span>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <div className="map-header">
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
              </svg>
              Interactive Map View
            </h2>
            <div className="map-controls">
              <button
                className="control-button"
                onClick={handleFindMe}
                title="Find My Location"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </svg>
                My Location
              </button>
              <button
                className="control-button"
                onClick={handleShowAll}
                title="Show All Shops"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
                Show All
              </button>
            </div>
          </div>

          <div className="map-container">
            <MapContainer
              center={[defaultLocation.lat, defaultLocation.lng]}
              zoom={10} // Zoomed out more to show wider area
              className="leaflet-map"
              ref={mapRef}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Location Marker with Circle */}
              {userLocation && (
                <>
                  <Circle
                    center={[userLocation.lat, userLocation.lng]}
                    radius={selectedDistance * 1000}
                    pathOptions={{
                      color: '#0ea5e9',
                      fillColor: '#0ea5e9',
                      fillOpacity: 0.1,
                      weight: 2
                    }}
                  />
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <div className="popup-content">
                        <strong>📍 Your Location</strong>
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}

              {/* Laundry Shop Markers */}
              {filteredShops.map((shop) => (
                <Marker key={shop.id} position={shop.position} icon={createCustomMarker(shop)}>
                  <Popup className="custom-popup">
                    <div className="popup-content">
                      <div className="popup-header">
                        <h3 className="popup-title">{shop.name}</h3>
                        <span
                          className="popup-status-badge"
                          style={{ backgroundColor: getStatusColor(shop.status) }}
                        >
                          {getStatusText(shop.status)}
                        </span>
                      </div>

                      <p className="popup-address">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {shop.address}
                      </p>

                      <div className="popup-rating-price">
                        <div className="popup-rating">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" width="16" height="16">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span>{shop.rating}/5.0</span>
                        </div>
                        <div className="popup-price">
                          Starting from <strong>{shop.basePrice} {shop.currency}</strong>
                        </div>
                      </div>

                      <div className="popup-services">
                        <strong>Services:</strong>
                        <div className="popup-service-tags">
                          {shop.services.map((service, idx) => (
                            <span key={idx} className="popup-service-tag">{service}</span>
                          ))}
                        </div>
                      </div>

                      <div className="popup-info">
                        <p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                          </svg>
                          {shop.hours}
                        </p>
                        <p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                          </svg>
                          {shop.phone}
                        </p>
                      </div>

                      <button
                        className="popup-view-btn"
                        onClick={() => navigate("/available-machines", { state: shop })}
                      >
                        View Available Machines →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="results-info">
            <p>Showing <strong>{filteredShops.length}</strong> of <strong>{laundryShops.length}</strong> laundry shops across Rawalpindi & Islamabad</p>
          </div>
        </section>

        {/* Shops Grid */}
        <section className="shops-section">
          <h2 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            Available Laundry Services
          </h2>

          {filteredShops.length === 0 ? (
            <div className="no-results">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <p>No laundry shops found matching your criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="shops-grid">
              {filteredShops.map((shop) => {
                const distance = userLocation
                  ? calculateDistance(userLocation.lat, userLocation.lng, shop.position[0], shop.position[1])
                  : null;

                return (
                  <div key={shop.id} className="shop-card">
                    <div className="shop-card-header">
                      <div className="shop-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 2.01L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6v-9h12v9zm0-11H6V4h12v5z" />
                        </svg>
                      </div>
                      <div className="shop-info">
                        <h3 className="shop-card-title">{shop.name}</h3>
                        <p className="shop-card-address">{shop.address}</p>
                        {distance && (
                          <p className="shop-distance">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            </svg>
                            {distance.toFixed(1)} km away
                          </p>
                        )}
                        <p className="shop-area" style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: '600', marginTop: '0.25rem' }}>
                          📍 {shop.area}
                        </p>
                      </div>
                      <span
                        className="shop-status-badge"
                        style={{ backgroundColor: getStatusColor(shop.status) }}
                      >
                        {getStatusText(shop.status)}
                      </span>
                    </div>

                    <div className="shop-card-body">
                      <div className="shop-card-rating-price">
                        <div className="shop-card-rating">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="rating-value">{shop.rating}</span>
                          <span className="rating-max">/5.0</span>
                        </div>
                        <div className="shop-card-price">
                          <span className="price-label">From</span>
                          <span className="price-value">{shop.basePrice} {shop.currency}</span>
                        </div>
                      </div>

                      <div className="shop-card-services">
                        <span className="services-label">Services:</span>
                        <div className="services-tags">
                          {shop.services.map((service, idx) => (
                            <span key={idx} className="service-tag">{service}</span>
                          ))}
                        </div>
                      </div>

                      <div className="shop-card-hours">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        <span>{shop.hours}</span>
                      </div>
                    </div>

                    <div className="shop-card-footer">
                      <button
                        className="shop-select-btn"
                        onClick={() => navigate("/available-machines", { state: shop })}
                      >
                        View Machines & Book
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;