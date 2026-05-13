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

const LAUNDRY_API_URL = 'https://localhost:7208/api/Laundry';
const MACHINES_API_URL = 'https://localhost:7208/api/machines';

const getMachineLaundryId = (machine) => machine.laundryId ?? machine.branchId ?? machine.laundry?.laundryId;

const isMachineAvailable = (machine) => {
    const status = String(machine.status ?? 'Available').toLowerCase();
    return ['available', 'active', 'free'].includes(status);
};

const getDefaultPrice = (capacity) => {
    if (capacity === '5kg') return 200;
    if (capacity === '7kg') return 300;
    if (capacity === '10kg') return 500;
    if (capacity === '15kg') return 700;
    return 300;
};

export const normalizeMachine = (machine) => ({
    ...machine,
    id: machine.id ?? machine.machineId,
    machineId: machine.machineId ?? machine.id,
    branchId: getMachineLaundryId(machine),
    laundryId: getMachineLaundryId(machine),
    machineType: machine.machineType ?? machine.type ?? 'Washer',
    capacity: machine.capacity ?? '7kg',
    status: isMachineAvailable(machine) ? 'Available' : (machine.status ?? 'Busy'),
    price: machine.price ?? getDefaultPrice(machine.capacity)
});

export const normalizeBranch = (laundry, machines = []) => {
    const id = laundry.id ?? laundry.laundryId;
    const laundryMachines = machines.filter(machine => String(getMachineLaundryId(machine)) === String(id));
    const availableWasher = laundryMachines.filter(machine => isMachineAvailable(machine) && ['Washer', 'Both'].includes(machine.machineType)).length;
    const availableDryer = laundryMachines.filter(machine => isMachineAvailable(machine) && ['Dryer', 'Both'].includes(machine.machineType)).length;
    const busyWasher = laundryMachines.filter(machine => !isMachineAvailable(machine) && ['Washer', 'Both'].includes(machine.machineType)).length;
    const busyDryer = laundryMachines.filter(machine => !isMachineAvailable(machine) && ['Dryer', 'Both'].includes(machine.machineType)).length;
    const availableTotal = availableWasher + availableDryer;
    const machineTotal = laundryMachines.length;

    // Automatic status logic: 
    // 1. If admin manually sets 'Busy', it's Red.
    // 2. If there are machines and ALL of them are busy (availableTotal === 0), it's Red.
    // 3. Otherwise, it's Green.
    const isManuallyBusy = String(laundry.status).toLowerCase() === 'busy';
    const isAutoBusy = machineTotal > 0 && availableTotal === 0;
    const finalStatus = (isManuallyBusy || isAutoBusy) ? 'Red' : 'Green';

    return {
        ...laundry,
        id,
        laundryId: id,
        name: laundry.name ?? 'Laundry',
        city: laundry.city ?? '',
        address: laundry.address ?? '',
        contact: laundry.contact ?? laundry.contactNumber ?? '',
        contactNumber: laundry.contactNumber ?? laundry.contact ?? '',
        position: [Number(laundry.latitude), Number(laundry.longitude)],
        rating: Number(laundry.rating ?? 4.5),
        basePrice: Number(laundry.basePrice ?? 500),
        status: finalStatus,
        machines: {
            available: { washer: availableWasher, dryer: availableDryer },
            busy: { washer: busyWasher, dryer: busyDryer }
        }
    };
};

export const fetchBranches = async () => {
    const [laundryRes, machinesRes] = await Promise.all([
        fetch(LAUNDRY_API_URL),
        fetch(MACHINES_API_URL)
    ]);

    if (!laundryRes.ok) throw new Error('Failed to fetch laundries');
    if (!machinesRes.ok) throw new Error('Failed to fetch machines');

    const laundries = await laundryRes.json();
    const machines = await machinesRes.json();
    const normalizedMachines = Array.isArray(machines) ? machines.map(normalizeMachine) : [];

    return (Array.isArray(laundries) ? laundries : [])
        .map(laundry => normalizeBranch(laundry, normalizedMachines))
        .filter(branch => Number.isFinite(branch.position[0]) && Number.isFinite(branch.position[1]));
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
