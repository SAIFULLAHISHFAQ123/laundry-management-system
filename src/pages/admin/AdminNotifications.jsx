import { useState, useEffect } from 'react';

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({ title: '', message: '', type: 'System' });

    useEffect(() => {
        const notifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        setNotifications(notifs.reverse());
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSend = (e) => {
        e.preventDefault();
        
        const newNotif = {
            id: Date.now(),
            ...formData,
            time: new Date().toLocaleString()
        };

        const updated = [...JSON.parse(localStorage.getItem('admin_notifications') || '[]'), newNotif];
        localStorage.setItem('admin_notifications', JSON.stringify(updated));
        setNotifications(updated.reverse());

        // Simulate sending to user notifications
        const userNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
        userNotifs.push({
            id: Date.now(),
            title: formData.title,
            message: formData.message,
            type: formData.type,
            timestamp: 'Just now',
            read: false
        });
        localStorage.setItem('user_notifications', JSON.stringify(userNotifs));

        alert('Notification pushed to users successfully!');
        setFormData({ title: '', message: '', type: 'System' });
    };

    const clearHistory = () => {
        if (window.confirm('Clear sent history?')) {
            localStorage.setItem('admin_notifications', JSON.stringify([]));
            setNotifications([]);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Send Notification Form */}
                <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '1.5rem' }}>
                    <h3 className="mb-4">Push New Alert</h3>
                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Alert Title</label>
                            <input className="input-control" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Branch Maintenance" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Target Type</label>
                            <select className="input-control" name="type" value={formData.type} onChange={handleChange}>
                                <option value="System">System Alert (All Users)</option>
                                <option value="Booking">Booking Update</option>
                                <option value="Promo">Promotion / Offer</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Message Content</label>
                            <textarea className="input-control" name="message" value={formData.message} onChange={handleChange} style={{ height: '100px', resize: 'none' }} placeholder="Type your message here..." required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Broadcast Message 🚀</button>
                    </form>
                </div>

                {/* Sent History */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Sent History</h3>
                        <button className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={clearHistory}>Clear History</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.length === 0 ? (
                            <div className="card text-center text-muted">No alerts sent yet.</div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className="card" style={{ display: 'flex', gap: '1rem', borderLeft: `5px solid var(--primary)` }}>
                                    <div style={{ fontSize: '1.5rem' }}>
                                        {notif.type === 'Booking' ? '🧺' : notif.type === 'Promo' ? '🎁' : '📢'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <strong style={{ fontSize: '1rem' }}>{notif.title}</strong>
                                            <small className="text-muted">{notif.time}</small>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{notif.message}</p>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{notif.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
