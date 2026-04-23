import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function Profile() {
  const navigate = useNavigate();
  const { reservations } = useBooking();
  
  const [user, setUser] = useState({ 
    name: 'Standard User', 
    email: 'user@example.com', 
    phone: '+92 300 1234567',
    city: 'Lahore'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  useEffect(() => {
    const role = localStorage.getItem('role') || 'User';
    const email = localStorage.getItem('user_email') || (role === 'Admin' ? 'admin@gmail.com' : 'user@example.com');
    const name = role === 'Admin' ? 'Admin User' : 'Standard User';
    
    const savedUser = JSON.parse(localStorage.getItem('profile_data') || 'null');
    if (savedUser) {
        setUser(savedUser);
        setEditForm(savedUser);
    } else {
        setUser({ ...user, name, email });
        setEditForm({ ...user, name, email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  const handleSave = () => {
    setUser(editForm);
    localStorage.setItem('profile_data', JSON.stringify(editForm));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const stats = {
    total: reservations.length,
    completed: reservations.filter(r => r.status === 'Completed').length,
    cancelled: reservations.filter(r => r.status === 'Cancelled').length,
    upcoming: reservations.filter(r => r.status === 'Upcoming').length,
  };

  return (
    <div className="container animate-in" style={{ maxWidth: '900px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>My Account</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="cart-layout">
        {/* Left Column: Avatar & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card text-center" style={{ padding: '2.5rem 1.5rem' }}>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold',
                    margin: '0 auto 1rem',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                }}>
                    {user.name.charAt(0)}
                </div>
                <h2 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{user.name}</h2>
                <p className="text-muted" style={{ margin: 0 }}>{user.email}</p>
                <div className="badge badge-primary mt-4">Verified Member</div>
            </div>

            <div className="card">
                <h3 className="mb-4">Quick Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total}</div>
                        <small className="text-muted">Total</small>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.completed}</div>
                        <small className="text-muted">Done</small>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.upcoming}</div>
                        <small className="text-muted">Active</small>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.cancelled}</div>
                        <small className="text-muted">Void</small>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="card">
            <div className="flex-between mb-6">
                <h3 style={{ margin: 0 }}>Profile Details</h3>
                {!isEditing ? (
                    <button className="btn btn-outline" style={{width: 'auto'}} onClick={() => setIsEditing(true)}>Edit Profile</button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ width: 'auto', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn btn-primary" style={{width: 'auto'}} onClick={handleSave}>Save Changes</button>
                    </div>
                )
            }
            </div>

            <div className="flex-column gap-6">
                <div className="grid-2">
                    <div className="form-group">
                        <label className="text-muted" style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Name</label>
                        <input 
                            className="input-control" 
                            type="text" 
                            value={isEditing ? editForm.name : user.name} 
                            readOnly={!isEditing} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted" style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
                        <input 
                            className="input-control" 
                            type="email" 
                            value={isEditing ? editForm.email : user.email} 
                            readOnly={!isEditing} 
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid-2">
                    <div className="form-group">
                        <label className="text-muted" style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Phone Number</label>
                        <input 
                            className="input-control" 
                            type="tel" 
                            value={isEditing ? editForm.phone : user.phone} 
                            readOnly={!isEditing} 
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted" style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>City</label>
                        <select 
                            className="input-control" 
                            value={isEditing ? editForm.city : user.city} 
                            disabled={!isEditing}
                            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        >
                            <option value="Lahore">Lahore</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                            <option value="Karachi">Karachi</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '1.25rem', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius)' }}>
                    <h4 className="mb-2">Account Security</h4>
                    <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>Protect your account with a strong password.</p>
                    <button className="btn btn-outline" style={{ display: 'inline-flex', width: 'auto', fontSize: '0.85rem' }}>Change Account Password</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
