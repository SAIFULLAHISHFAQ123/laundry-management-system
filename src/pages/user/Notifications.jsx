import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Merge system notifications (e.g. from local storage)
    const stored = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    
    // If empty, add some mock welcome ones
    if (stored.length === 0) {
        const initial = [
            { id: 1, type: 'System', title: 'Welcome!', message: 'Welcome to Laundry Management System. Start by exploring laundries near you.', timestamp: 'Just now', read: false },
            { id: 2, type: 'Promo', title: 'Weekend Offer', message: 'Get 20% off on your next blanket wash this weekend!', timestamp: '2 hours ago', read: false }
        ];
        setNotifications(initial);
        localStorage.setItem('user_notifications', JSON.stringify(initial));
    } else {
        setNotifications(stored.sort((a, b) => (b.id || 0) - (a.id || 0)));
    }
  }, []);

  const clearAll = () => {
    if (window.confirm('Clear all notifications?')) {
        localStorage.setItem('user_notifications', JSON.stringify([]));
        setNotifications([]);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  };

  return (
    <div className="container animate-in" style={{ maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>Notifications</h1>
        {notifications.length > 0 && (
            <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={clearAll}>Clear All</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.length === 0 ? (
          <div className="card text-center text-muted" style={{ padding: '5rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h3>All caught up!</h3>
            <p>You have no new notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
                key={notif.id} 
                className="card" 
                onClick={() => !notif.read && markAsRead(notif.id)}
                style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    alignItems: 'flex-start',
                    borderLeft: `5px solid ${notif.read ? 'var(--border)' : 'var(--primary)'}`,
                    opacity: notif.read ? 0.75 : 1,
                    transition: 'all 0.2s',
                    cursor: notif.read ? 'default' : 'pointer',
                    backgroundColor: notif.read ? 'var(--bg-white)' : 'var(--primary-light)'
                }}
            >
              <div style={{ 
                  fontSize: '1.5rem', 
                  backgroundColor: 'white', 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0
              }}>
                {notif.type === 'Booking' ? '🧺' : notif.type === 'Promo' ? '🎁' : '📢'}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{notif.title || 'Notification'}</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{notif.timestamp}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{notif.message}</p>
              </div>

              {!notif.read && (
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)', alignSelf: 'center' }}></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
