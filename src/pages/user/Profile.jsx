import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function Profile() {
    const navigate = useNavigate();
    const { reservations } = useBooking();

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        city: 'Lahore'
    });

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: 'Lahore'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isDbVerified, setIsDbVerified] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('user_name');
        const storedEmail = localStorage.getItem('user_email');

        if (!token) {
            navigate('/');
            return;
        }

        // Initialize with local data as a placeholder
        const initialData = {
            name: storedName || 'User',
            email: storedEmail || '',
            phone: localStorage.getItem('user_phone') || '+92 300 1234567',
            city: localStorage.getItem('user_city') || 'Islamabad'
        };
        setUser(initialData);
        setEditForm(initialData);

        // Even for hardcoded users, we try to show the status
        if (token.startsWith('hardcoded-')) {
            setIsLoading(false);
            setIsDbVerified(false); // Hardcoded is not from DB
            return;
        }

        try {
            const res = await fetch('https://localhost:7208/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const data = await res.json();
                const userData = {
                    name: data.fullName || data.name || storedName,
                    email: data.email || storedEmail,
                    phone: data.phone || data.phoneNumber || '+92 300 1234567',
                    city: data.city || 'Islamabad'
                };
                setUser(userData);
                setEditForm(userData);
                setIsDbVerified(true); // Data successfully fetched from DB
            } else {
                setError("Could not sync with database. Showing session data.");
                setIsDbVerified(false);
            }
        } catch (err) {
            console.error("Profile API fetch failed:", err);
            setError("Database connection error. Using local profile.");
            setIsDbVerified(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleSave = () => {
        setUser(editForm);
        localStorage.setItem('user_name', editForm.name);
        localStorage.setItem('user_email', editForm.email);
        localStorage.setItem('user_phone', editForm.phone);
        localStorage.setItem('user_city', editForm.city);
        setIsEditing(false);
        alert("Profile updated successfully ✅");
    };

    const stats = {
        total: reservations.length,
        completed: reservations.filter(r => r.status === 'Completed').length,
        cancelled: reservations.filter(r => r.status === 'Cancelled').length,
        upcoming: reservations.filter(r => r.status === 'Upcoming').length,
    };

    if (isLoading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="brand-icon animate-pulse" style={{ margin: '0 auto 1rem' }}>L</div>
                    <p className="text-muted">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-in" style={{ maxWidth: '1000px', padding: '2rem 1rem' }}>
            
            {/* Error Banner */}
            {error && (
                <div style={{ 
                    background: '#fff1f2', 
                    color: '#e11d48', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    marginBottom: '1.5rem',
                    border: '1px solid #fecdd3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Header Section */}
            <div className="flex-between mb-8" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Account Settings</h1>
                    <p className="text-muted">Manage your profile information and view your activity.</p>
                </div>
                <button className="btn btn-outline" onClick={handleLogout} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    🔒 Sign Out
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
                {/* Profile Card Sidebar */}
                <div className="flex-column gap-6">
                    <div className="selection-card text-center" style={{ padding: '3rem 2rem' }}>
                        <div style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)'
                        }}>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{user.name}</h2>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user.email}</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem 1.5rem', borderRadius: '50px', fontWeight: '700', width: 'fit-content' }}>
                                Member Since 2024
                            </span>
                            {isDbVerified && (
                                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    ✓ Verified from Database
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="selection-card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            📊 Activity Analytics
                        </h3>
                        <div className="grid-2" style={{ gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.total}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders</div>
                            </div>
                            <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{stats.completed}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</div>
                            </div>
                            <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{stats.upcoming}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active</div>
                            </div>
                            <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>{stats.cancelled}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Canceled</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Profile Info */}
                <div className="selection-card" style={{ padding: '2.5rem' }}>
                    <div className="flex-between mb-8">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Personal Information</h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-column gap-6">
                        <div className="grid-2" style={{ gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                <input
                                    className="input-control"
                                    value={isEditing ? editForm.name : user.name}
                                    disabled={!isEditing}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    style={!isEditing ? { backgroundColor: 'var(--bg-light)', borderColor: 'transparent' } : {}}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                                <input
                                    className="input-control"
                                    value={isEditing ? editForm.email : user.email}
                                    disabled={!isEditing}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    style={!isEditing ? { backgroundColor: 'var(--bg-light)', borderColor: 'transparent' } : {}}
                                />
                            </div>
                        </div>

                        <div className="grid-2" style={{ gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Phone Number</label>
                                <input
                                    className="input-control"
                                    value={isEditing ? editForm.phone : user.phone}
                                    disabled={!isEditing}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    style={!isEditing ? { backgroundColor: 'var(--bg-light)', borderColor: 'transparent' } : {}}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>City / Region</label>
                                <select
                                    className="input-control"
                                    value={isEditing ? editForm.city : user.city}
                                    disabled={!isEditing}
                                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    style={!isEditing ? { backgroundColor: 'var(--bg-light)', borderColor: 'transparent' } : {}}
                                >
                                    <option>Islamabad</option>
                                    <option>Rawalpindi</option>
                                    <option>Lahore</option>
                                    <option>Karachi</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--primary-light)', borderRadius: '16px', border: '1px solid var(--primary)', opacity: 0.8 }}>
                            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '1rem' }}>🛡️ Privacy & Security</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.5 }}>
                                Your personal data is encrypted and stored securely. We never share your contact information with third-party vendors without your explicit consent.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    div[style*="grid-template-columns: 320px 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}