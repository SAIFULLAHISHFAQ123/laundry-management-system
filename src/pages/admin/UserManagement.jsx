import { useState, useEffect } from 'react';
import '../../styles/admin.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // ================= LOAD DATA =================
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first");
            return;
        }
        fetchUsers();
    }, []);

    // ================= FETCH USERS =================
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(
                'https://localhost:7208/api/auth/users',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                alert("Unauthorized. Please login again.");
                return;
            }

            if (!response.ok) {
                console.error("Server error:", response.status);
                return;
            }

            const data = await response.json();
            setUsers(data);
        }
        catch (error) {
            console.error("Failed to fetch users:", error);
        }
        finally {
            setLoading(false);
        }
    };

    // ================= DELETE USER =================
    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `https://localhost:7208/api/auth/users/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                alert("User deleted successfully");
                setUsers(users.filter(user => user.id !== id));
            } else {
                console.error("Delete failed:", response.status);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // ================= FILTER USERS =================
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="admin-container animate-in">
            {/* ================= HEADER ================= */}
            <header className="flex-between mb-8">
                <div>
                    <h2 className="admin-page-title">User Management</h2>
                    <p className="text-muted">View and manage registered users.</p>
                </div>
                <div className="badge badge-primary" style={{ padding: '0.75rem 1.5rem' }}>
                    Total Users: {filteredUsers.length}
                </div>
            </header>

            {/* ================= SEARCH ================= */}
            <div className="admin-card mb-6">
                <input
                    type="text"
                    className="input-control"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: 0, width: '100%' }}
                />
            </div>

            {/* ================= TABLE ================= */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem' }}>User Info</th>
                            <th style={{ padding: '1.25rem' }}>Contact</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center p-12 text-muted">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="3" className="text-center p-12 text-muted">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                            }}>
                                                {(user.fullName || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>{user.fullName}</strong>
                                                <br />
                                                <small className="text-muted">ID: {user.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div>{user.email}</div>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{user.phone || 'No phone'}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                            onClick={() => handleDeleteUser(user.id)}
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