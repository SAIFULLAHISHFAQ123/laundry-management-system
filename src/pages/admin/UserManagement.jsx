import { useState, useEffect } from 'react';
import '../../styles/admin.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('All');
    const [laundryFilter, setLaundryFilter] = useState('All');

    useEffect(() => {
        fetchUsers();
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await fetch('https://localhost:7208/api/Laundry');
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }
        } catch (err) {
            console.error("Failed to fetch branches for filter", err);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // First try api/auth/users
            let res = await fetch('https://localhost:7208/api/auth/users');
            
            // If 404, try api/Users (in case there is a separate controller)
            if (res.status === 404) {
                res = await fetch('https://localhost:7208/api/Users');
            }

            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                console.error("Server returned error:", res.status);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`https://localhost:7208/api/auth/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('User deleted successfully');
                setUsers(users.filter(u => (u.id || u.userId) !== id));
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            (u.fullName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCity = cityFilter === 'All' || u.city === cityFilter;
        const matchesLaundry = laundryFilter === 'All' || String(u.laundryId) === String(laundryFilter);

        return matchesSearch && matchesCity && matchesLaundry;
    });

    const cities = [...new Set(users.map(u => u.city).filter(Boolean))];

    return (
        <div className="admin-container animate-in">
            <header className="flex-between mb-8">
                <div>
                    <h2 className="admin-page-title">User Management</h2>
                    <p className="text-muted">Filter and manage users by location and laundry affiliation.</p>
                </div>
                <div className="badge badge-primary" style={{ padding: '0.75rem 1.5rem' }}>
                    Active Users: {filteredUsers.length}
                </div>
            </header>

            {/* Filters Section */}
            <div className="admin-card mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: '1rem', alignItems: 'center' }}>
                <input 
                    type="text" 
                    className="input-control" 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: 0 }}
                />
                
                <select className="input-control" style={{ margin: 0 }} value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                    <option value="All">All Cities</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                </select>

                <select className="input-control" style={{ margin: 0 }} value={laundryFilter} onChange={(e) => setLaundryFilter(e.target.value)}>
                    <option value="All">All Laundries</option>
                    {branches.map(b => (
                        <option key={b.id || b.laundryId} value={b.id || b.laundryId}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem' }}>User Info</th>
                            <th style={{ padding: '1.25rem' }}>Contact</th>
                            <th style={{ padding: '1.25rem' }}>Role</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center p-12 text-muted">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" className="text-center p-12 text-muted">No users found.</td></tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id || u.userId} style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                borderRadius: '50%', 
                                                backgroundColor: 'var(--primary-light)', 
                                                color: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold'
                                            }}>
                                                {(u.fullName || u.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block' }}>{u.fullName || u.name}</strong>
                                                <small className="text-muted">ID: {u.id || u.userId}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{u.email}</div>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{u.phone || u.phoneNumber || 'No phone'}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span className={`badge ${u.role === 'Admin' ? 'badge-primary' : 'badge-success'}`}>
                                            {u.role || 'User'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <button 
                                            className="btn btn-outline" 
                                            style={{ 
                                                borderColor: 'var(--danger)', 
                                                color: 'var(--danger)', 
                                                fontSize: '0.75rem', 
                                                padding: '0.4rem 1rem' 
                                            }}
                                            onClick={() => handleDeleteUser(u.id || u.userId)}
                                        >
                                            Delete User
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
