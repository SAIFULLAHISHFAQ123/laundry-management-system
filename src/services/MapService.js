export const MOCK_BRANCHES = [
    {
        id: 1,
        name: 'Clean Wash Central (F-10)',
        city: 'Islamabad',
        address: 'F-10 Markaz, Street 12',
        contact: '+92 300 1234567',
        position: [33.6934, 73.0138],
        rating: 4.8,
        basePrice: 500,
        status: 'Green', // Available
        machines: {
            available: { washer: 6, dryer: 6 },
            busy: { washer: 2, dryer: 1 }
        }
    },
    {
        id: 2,
        name: 'Quick Spin Laundry (I-8)',
        city: 'Islamabad',
        address: 'I-8 Markaz, Sector I',
        contact: '+92 311 9876543',
        position: [33.6650, 73.0550],
        rating: 4.5,
        basePrice: 450,
        status: 'Red', // Busy
        machines: {
            available: { washer: 0, dryer: 0 },
            busy: { washer: 5, dryer: 5 }
        }
    },
    {
        id: 3,
        name: 'BubbleClean Hub (E-11)',
        city: 'Islamabad',
        address: 'E-11/3, Main Road',
        contact: '+92 321 4455667',
        position: [33.6950, 72.9800],
        rating: 4.2,
        basePrice: 600,
        status: 'Orange', // Free in 10 mins
        machines: {
            available: { washer: 1, dryer: 1 },
            busy: { washer: 3, dryer: 3 }
        }
    },
    {
        id: 4,
        name: 'EcoWash Solutions (G-11)',
        city: 'Islamabad',
        address: 'G-11 Markaz',
        contact: '+92 345 0001112',
        position: [33.6750, 73.0050],
        rating: 4.6,
        basePrice: 550,
        status: 'Green',
        machines: {
            available: { washer: 5, dryer: 5 },
            busy: { washer: 0, dryer: 1 }
        }
    },
    {
        id: 5,
        name: 'Royal Laundry (Blue Area)',
        city: 'Islamabad',
        address: 'Blue Area, Near Centaurus',
        contact: '+92 333 5556667',
        position: [33.7077, 73.0487],
        rating: 4.9,
        basePrice: 750,
        status: 'Green',
        machines: {
            available: { washer: 10, dryer: 8 },
            busy: { washer: 2, dryer: 2 }
        }
    }
];

export const getBranches = () => {
    const stored = JSON.parse(localStorage.getItem('laundry_branches') || 'null');
    // If stored is an empty array, we also want to return MOCK_BRANCHES or at least handle it
    if (!stored || (Array.isArray(stored) && stored.length === 0)) {
        return MOCK_BRANCHES;
    }
    return stored;
};

export const haversineDistance = (coords1, coords2) => {
    if (!Array.isArray(coords1) || !Array.isArray(coords2) || coords1.length < 2 || coords2.length < 2) {
        return Infinity; // Return a large distance if coordinates are invalid
    }
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
