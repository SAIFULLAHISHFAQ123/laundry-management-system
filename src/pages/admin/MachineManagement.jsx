import { useState, useEffect } from 'react';
import { getBranches } from '../../services/MapService';
import '../../styles/admin.css';

export default function MachineManagement() {
    const [machines, setMachines] = useState([]);
    const [filterBranch, setFilterBranch] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('admin_machines') || '[]');
        setMachines(stored);
        setBranches(getBranches());
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this machine? This cannot be undone.')) {
            const updated = machines.filter(m => m.id !== id);
            localStorage.setItem('admin_machines', JSON.stringify(updated));
            setMachines(updated);
        }
    };

    const toggleStatus = (id) => {
        const updated = machines.map(m => {
            if (m.id === id) {
                const newStatus = m.status === 'Active' ? 'Maintenance' : 'Active';
                return { ...m, status: newStatus };
            }
            return m;
        });
        localStorage.setItem('admin_machines', JSON.stringify(updated));
        setMachines(updated);
    };

    const filtered = machines.filter(m => {
        const branchMatch = filterBranch === 'All' || m.branchName === filterBranch;
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
                        {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
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
                {filtered.length === 0 ? (
                    <div className="stat-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', borderTopColor: 'var(--border)' }}>
                        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚙️</div>
                        <p className="text-muted">No machines found for these filters.</p>
                        <button className="btn btn-primary mt-4" onClick={() => setFilterBranch('All')}>Explore All Units</button>
                    </div>
                ) : (
                    filtered.map((mac) => (
                        <div key={mac.id} className="stat-card animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTopColor: mac.status === 'Active' ? '#10b981' : '#ef4444' }}>
                            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>{mac.name || mac.id}</div>
                                    <small className="text-muted" style={{textTransform: 'uppercase', fontWeight: 600, fontSize: '0.7rem'}}>{mac.machineType} • {mac.capacity}</small>
                                </div>
                                <span className={`badge ${mac.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                    {mac.status}
                                </span>
                            </div>

                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '12px', fontSize: '0.85rem' }}>
                                <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted">Unit ID:</span> <strong>{mac.id}</strong>
                                </div>
                                <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted">Laundry:</span> <strong>{mac.branchName}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted">Hourly Rate:</span> <strong style={{color: 'var(--primary)'}}>PKR {mac.price}</strong>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                                <button 
                                    className="btn btn-outline w-full" 
                                    style={{ fontSize: '0.8rem', padding: '0.75rem' }}
                                    onClick={() => toggleStatus(mac.id)}
                                >
                                    {mac.status === 'Active' ? 'Shutdown' : 'Activate'}
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    style={{ flex: '0 0 48px', height: '48px', padding: 0, borderRadius: '12px' }}
                                    onClick={() => handleDelete(mac.id)}
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
