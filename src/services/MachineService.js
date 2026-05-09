export const MOCK_MACHINES = [
    // Branch 1
    { id: 'W-101', branchId: 1, machineType: 'Washer', capacity: '5kg', status: 'Available', price: 200 },
    { id: 'W-102', branchId: 1, machineType: 'Washer', capacity: '7kg', status: 'Available', price: 300 },
    { id: 'W-103', branchId: 1, machineType: 'Washer', capacity: '10kg', status: 'Available', price: 500 },
    { id: 'D-101', branchId: 1, machineType: 'Dryer', capacity: '5kg', status: 'Available', price: 200 },
    { id: 'D-102', branchId: 1, machineType: 'Dryer', capacity: '7kg', status: 'Available', price: 300 },
    // Branch 2
    { id: 'W-201', branchId: 2, machineType: 'Washer', capacity: '7kg', status: 'Available', price: 300 },
    { id: 'D-201', branchId: 2, machineType: 'Dryer', capacity: '7kg', status: 'Available', price: 300 },
    // Branch 3
    { id: 'W-301', branchId: 3, machineType: 'Washer', capacity: '10kg', status: 'Available', price: 500 },
    { id: 'D-301', branchId: 3, machineType: 'Dryer', capacity: '10kg', status: 'Available', price: 500 },
    // Branch 4
    { id: 'W-401', branchId: 4, machineType: 'Washer', capacity: '5kg', status: 'Available', price: 200 },
    { id: 'D-401', branchId: 4, machineType: 'Dryer', capacity: '5kg', status: 'Available', price: 200 },
    // Branch 5
    { id: 'W-501', branchId: 5, machineType: 'Washer', capacity: '10kg', status: 'Available', price: 500 },
    { id: 'D-501', branchId: 5, machineType: 'Dryer', capacity: '10kg', status: 'Available', price: 500 },
];

export const getAvailableMachines = (branch, type) => {
    const adminMachines = JSON.parse(localStorage.getItem('admin_machines') || '[]');
    const all = [...MOCK_MACHINES, ...adminMachines];
    
    if (type === 'Both') {
        return all.filter(m => m.branchId === branch?.id && m.status === 'Available');
    }
    
    return all.filter(m => m.branchId === branch?.id && m.machineType === type && m.status === 'Available');
};

const MACHINES_API_URL = 'https://localhost:7208/api/machines';

const getDefaultPrice = (capacity) => {
    if (capacity === '5kg') return 200;
    if (capacity === '7kg') return 300;
    if (capacity === '10kg') return 500;
    if (capacity === '15kg') return 700;
    return 300;
};

const isMachineAvailable = (machine) => {
    const status = String(machine.status ?? 'Available').toLowerCase();
    return ['available', 'active', 'free'].includes(status);
};

const normalizeMachine = (machine) => {
    const laundryId = machine.laundryId ?? machine.branchId ?? machine.laundry?.laundryId;

    return {
        ...machine,
        id: machine.id ?? machine.machineId,
        machineId: machine.machineId ?? machine.id,
        branchId: laundryId,
        laundryId,
        machineType: machine.machineType ?? machine.type ?? 'Washer',
        capacity: machine.capacity ?? '7kg',
        status: isMachineAvailable(machine) ? 'Available' : (machine.status ?? 'Busy'),
        price: machine.price ?? getDefaultPrice(machine.capacity)
    };
};

export const fetchAvailableMachines = async (branch, type = 'Both') => {
    if (!branch?.id && !branch?.laundryId) return [];

    const res = await fetch(MACHINES_API_URL);
    if (!res.ok) throw new Error('Failed to fetch machines');

    const data = await res.json();
    const branchId = branch.id ?? branch.laundryId;

    return (Array.isArray(data) ? data : [])
        .map(normalizeMachine)
        .filter(machine => String(machine.branchId) === String(branchId))
        .filter(machine => machine.status === 'Available')
        .filter(machine => type === 'Both' || machine.machineType === type || machine.machineType === 'Both');
};
