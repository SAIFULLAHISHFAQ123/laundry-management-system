import { useState, useEffect } from 'react';
import { getBranches } from '../../services/MapService';
import '../../styles/admin.css';

export default function MachineManagement() {
    const [machines, setMachines] = useState([]);
    const [filterBranch, setFilterBranch] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [macRes, branchRes] = await Promise.all([
                fetch('https://localhost:7208/api/machines'),
                fetch('https://localhost:7208/api/Laundry')
            ]);

            if (macRes.ok) {
                const macData = await macRes.json();
                setMachines(macData);
            }

            if (branchRes.ok) {
                const branchData = await branchRes.json();
                setBranches(branchData);
            }
        } catch (error) {
            console.error("Failed to fetch machine management data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this machine?')) return;

        try {
            const res = await fetch(`https://localhost:7208/api/machines/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Machine deactivated successfully');
                setMachines(machines.filter(m => m.machineId !== id));
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const toggleStatus = async (mac) => {
        try {
            const newStatus = !mac.isActive;
            const res = await fetch(`https://localhost:7208/api/machines/${mac.machineId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...mac,
                    isActive: newStatus,
                    updatedAt: new Date().toISOString()
                })
            });

            if (res.ok) {
                setMachines(machines.map(m => m.machineId === mac.machineId ? { ...m, isActive: newStatus } : m));
            }
        } catch (error) {
            console.error("Status toggle failed", error);
        }
    };

    const filtered = machines.filter(m => {
        const branchMatch = filterBranch === 'All' || m.laundry?.name === filterBranch;
        const typeMatch = filterType === 'All' || m.machineType === filterType;
        return branchMatch && typeMatch;
    });

    return (
        <div className="admin-container">
            {/* Filters Bar */}
            <div className="admin-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem', alignItems: 'flex-end', padding: '1.25rem' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label className="admin-nav-label" style={{ padding: '0 0 0.5rem 0' }}>Filter by Branch</label>
                    <select className="input-control" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} style={{marginBottom: 0}}>
                        <option value="All">All Branches</option>
                        {branches.map(b => <option key={b.laundryId} value={b.name}>{b.name}</option>)}
                    </select>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <label className="admin-nav-label" style={{ padding: '0 0 0.5rem 0' }}>Filter by Type</label>
                    <select className="input-control" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{marginBottom: 0}}>
                        <option value="All">All Types</option>
                        <option value="Washer">Washers</option>
                        <option value="Dryer">Dryers</option>
                        <option value="Both">Combo Units</option>
                    </select>
                </div>
                <button className="btn btn-outline" style={{ height: '48px', padding: '0 1.5rem' }} onClick={() => { setFilterBranch('All'); setFilterType('All'); }}>Reset</button>
            </div>

            {/* Machines Grid */}
            <div className="grid-3">
                {loading ? (
                    <div className="stat-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
                        <p className="text-muted">Loading machines...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="stat-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', borderTopColor: 'var(--border)' }}>
                        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚙️</div>
                        <p className="text-muted">No machines found for these filters.</p>
                        <button className="btn btn-primary mt-4" onClick={() => setFilterBranch('All')}>Explore All Units</button>
                    </div>
                ) : (
                    filtered.map((mac) => (
                        <div key={mac.machineId} className="stat-card animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTopColor: mac.isActive ? '#10b981' : '#ef4444' }}>
                            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>{mac.name}</div>
                                    <small className="text-muted" style={{textTransform: 'uppercase', fontWeight: 600, fontSize: '0.7rem'}}>{mac.machineType} • {mac.capacity}</small>
                                </div>
                                <span className={`badge ${mac.isActive ? 'badge-success' : 'badge-danger'}`}>
                                    {mac.isActive ? 'Active' : 'Offline'}
                                </span>
                            </div>

                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '12px', fontSize: '0.85rem' }}>
                                <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted">Unit ID:</span> <strong>{mac.machineId}</strong>
                                </div>
                                <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted">Laundry:</span> <strong>{mac.laundry?.name || 'N/A'}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted">Capacity:</span> <strong style={{color: 'var(--primary)'}}>{mac.capacity}</strong>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                                <button 
                                    className="btn btn-outline w-full" 
                                    style={{ fontSize: '0.8rem', padding: '0.75rem' }}
                                    onClick={() => toggleStatus(mac)}
                                >
                                    {mac.isActive ? 'Shutdown' : 'Activate'}
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    style={{ flex: '0 0 48px', height: '48px', padding: 0, borderRadius: '12px' }}
                                    onClick={() => handleDelete(mac.machineId)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
