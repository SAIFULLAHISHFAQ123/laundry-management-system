export const MOCK_MACHINES = [
    // Branch 1
    { id: 'W-101', branchId: 1, machineType: 'Washer', capacity: '7kg', status: 'Available', price: 0 },
    { id: 'W-102', branchId: 1, machineType: 'Washer', capacity: '7kg', status: 'Available', price: 0 },
    { id: 'D-101', branchId: 1, machineType: 'Dryer', capacity: '7kg', status: 'Available', price: 0 },
    { id: 'D-102', branchId: 1, machineType: 'Dryer', capacity: '7kg', status: 'Available', price: 0 },
    // Branch 2
    { id: 'W-201', branchId: 2, machineType: 'Washer', capacity: '8kg', status: 'Available', price: 0 },
    { id: 'D-201', branchId: 2, machineType: 'Dryer', capacity: '8kg', status: 'Available', price: 0 },
    // Branch 3
    { id: 'W-301', branchId: 3, machineType: 'Washer', capacity: '10kg', status: 'Available', price: 0 },
    { id: 'D-301', branchId: 3, machineType: 'Dryer', capacity: '10kg', status: 'Available', price: 0 },
    // Branch 4
    { id: 'W-401', branchId: 4, machineType: 'Washer', capacity: '7kg', status: 'Available', price: 0 },
    { id: 'D-401', branchId: 4, machineType: 'Dryer', capacity: '7kg', status: 'Available', price: 0 },
    // Branch 5
    { id: 'W-501', branchId: 5, machineType: 'Washer', capacity: '12kg', status: 'Available', price: 0 },
    { id: 'D-501', branchId: 5, machineType: 'Dryer', capacity: '12kg', status: 'Available', price: 0 },
];

export const getAvailableMachines = (branch, type) => {
    const adminMachines = JSON.parse(localStorage.getItem('admin_machines') || '[]');
    const all = [...MOCK_MACHINES, ...adminMachines];
    
    if (type === 'Both') {
        return all.filter(m => m.branchId === branch?.id && m.status === 'Available');
    }
    
    return all.filter(m => m.branchId === branch?.id && m.machineType === type && m.status === 'Available');
};
