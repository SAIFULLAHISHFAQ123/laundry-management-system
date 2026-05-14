import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
    // Auth State
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);

    // Flow State
    const [bookingData, setBookingData] = useState({
        branch: null,
        machineType: 'Washer',
        date: new Date().toISOString().split('T')[0],
        timeSlots: [],
        clothType: null,
        numLoads: 1,
        detergent: null,
        machine: null,
        isQueued: false,
        estimatedArrival: null,
        machineQuantities: { '5kg': 0, '7kg': 0, '10kg': 0 },
        selectedMachines: []
    });

    // Safe JSON Parse Helper
    const safeParse = (key, fallback) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return fallback;
        }
    };

    // Cart State
    const [cart, setCart] = useState(() => safeParse('laundry_cart', []));
    
    // Reservations State
    const [reservations, setReservations] = useState(() => safeParse('laundry_reservations', []));

    useEffect(() => {
        localStorage.setItem('laundry_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('laundry_reservations', JSON.stringify(reservations));
    }, [reservations]);

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'laundry_reservations') {
                setReservations(JSON.parse(e.newValue || '[]'));
            }
            if (e.key === 'laundry_cart') {
                setCart(JSON.parse(e.newValue || '[]'));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Rating State
    const [ratings, setRatings] = useState(() => safeParse('laundry_ratings', [
        { id: 1, userId: 101, adminId: 'Main Branch', rating: 5, comment: 'Excellent service!', date: '2026-05-10' },
        { id: 2, userId: 102, adminId: 'West Side', rating: 4, comment: 'Fast and clean.', date: '2026-05-12' }
    ]));

    // Notification State for real-time popups
    const [activeNotification, setActiveNotification] = useState(null);
    const [pendingRatingPrompt, setPendingRatingPrompt] = useState(null);

    useEffect(() => {
        localStorage.setItem('laundry_ratings', JSON.stringify(ratings));
    }, [ratings]);

    // DB-Based Notification Monitoring (Checks every 5 seconds for responsiveness)
    useEffect(() => {
        const checkDBBookings = async () => {
            if (role !== 'User') return;
            const userId = localStorage.getItem('user_id') || 1;

            try {
                const res = await fetch(`https://localhost:7208/api/Booking/UserHistory/${userId}`);
                if (!res.ok) return;
                
                const dbBookings = await res.json();
                
                dbBookings.forEach(b => {
                    const status = b.bookingStatus || b.status;
                    
                    // If Admin marked it as completed in DB, prompt the User via Alert Notification!
                    if (status === 'Completed') {
                        const alreadyPrompted = JSON.parse(localStorage.getItem('prompted_bookings') || '[]');
                        if (!alreadyPrompted.includes(b.bookingId)) {
                            // Don't mark as prompted until they actually click the notification
                            // Just show the notification repeatedly until they click it
                            
                            // Check if a notification is already showing for this booking to avoid spam
                            if (!activeNotification || activeNotification.bookingId !== b.bookingId) {
                                triggerNotification(
                                    `Your service at ${b.laundry?.name || 'Laundry'} is complete! Click here to rate your experience.`, 
                                    b.bookingId,
                                    'Service Completed! 🎉',
                                    {
                                        bookingId: b.bookingId || b.id,
                                        laundryId: b.laundryId || 1,
                                        userId: userId,
                                        targetName: b.laundry?.name || 'Laundry',
                                        role: 'User'
                                    }
                                );
                            }
                        }
                    }
                });
            } catch (err) {
                // Silently ignore polling errors
            }
        };

        const interval = setInterval(checkDBBookings, 5000);
        return () => clearInterval(interval);
    }, [role, activeNotification]);

    const triggerNotification = (message, id, customTitle = null, ratingActionData = null) => {
        const newNotif = {
            id: Date.now(),
            bookingId: id,
            type: ratingActionData ? 'Rating' : 'Booking',
            title: customTitle || 'Job Finishing Soon',
            message,
            ratingActionData,
            timestamp: 'Just now',
            read: false
        };

        // Add to User Notifications
        const userNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
        localStorage.setItem('user_notifications', JSON.stringify([newNotif, ...userNotifs]));

        // Add to Admin Notifications
        const adminNotifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        localStorage.setItem('admin_notifications', JSON.stringify([newNotif, ...adminNotifs]));

        // Show Popup
        setActiveNotification(newNotif);
        
        if (!ratingActionData) {
            setTimeout(() => setActiveNotification(null), 5000);
        }
    };

    const addRating = async (ratingData) => {
        try {
            // Update local state for immediate UI feedback
            setRatings(prev => [{ 
                RatingId: Date.now(), 
                Stars: ratingData.Stars, 
                Comment: ratingData.Comment, 
                LaundryName: ratingData.LaundryName || 'Feedback', 
                UserName: role === 'Admin' ? 'Admin' : 'You' 
            }, ...prev]);

            // Post to backend
            const response = await fetch('https://localhost:7208/api/Rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ratingData)
            });

            if (!response.ok) {
                console.error("Failed to submit rating to DB");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    const updateBooking = (key, value) => {
        setBookingData(prev => ({ ...prev, [key]: value }));
    };

    const resetBooking = () => {
        setBookingData({
            branch: bookingData.branch, // Keep the branch context
            machineType: 'Washer',
            date: new Date().toISOString().split('T')[0],
            timeSlots: [],
            clothType: null,
            detergent: null,
            machine: null,
            selectedMachines: [],
            machineQuantities: {},
            isQueued: false,
            estimatedArrival: null
        });
    };

    const addToCart = (finalDetergent) => {
        const detergentToUse = finalDetergent || bookingData.detergent;
        const slotsPrice = (bookingData.timeSlots || []).reduce((sum, slot) => sum + (slot.price || 0), 0);
        let machinesPrice = 0;
        if (bookingData.selectedMachines) {
            bookingData.selectedMachines.forEach(m => { machinesPrice += m.price || 0; });
        }
        
        const newItem = {
            id: Date.now(),
            ...bookingData,
            detergent: detergentToUse,
            totalPrice: slotsPrice + machinesPrice + (detergentToUse?.price || 0)
        };
        setCart(prev => [...prev, newItem]);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const createBooking = (items) => {
        const newReservations = items.map(item => ({
            ...item,
            bookingId: 'LMS-' + Math.floor(Math.random() * 900000 + 100000),
            status: 'Upcoming',
            queuePosition: Math.floor(Math.random() * 5 + 1),
            timestamp: new Date().toISOString()
        }));
        setReservations(prev => [...prev, ...newReservations]);
        setCart(prev => prev.filter(item => !items.find(i => i.id === item.id)));
    };

    const cancelBooking = async (bookingId) => {
        try {
            // If it's a numeric ID (DB ID), call the API
            if (!isNaN(bookingId)) {
                const url = `https://localhost:7208/api/Booking/Cancel/${bookingId}`;
                console.log(`Attempting to cancel booking at: ${url}`);
                
                const res = await fetch(url, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server returned ${res.status}: ${errorText || 'Unknown error'}`);
                }
            }

            // Sync local state
            setReservations(prev => prev.map(res => 
                res.bookingId === bookingId ? { ...res, status: 'Cancelled' } : res
            ));
            
            return true;
        } catch (error) {
            console.error("Cancellation failed:", error);
            alert(`Cancellation Error: ${error.message}\n\nPlease ensure your Backend is running and has the new Cancel endpoint.`);
            return false;
        }
    };

    const completeBooking = async (bookingObjOrId) => {
        try {
            // Support passing either just an ID or the full booking object
            const bookingId = typeof bookingObjOrId === 'object' ? (bookingObjOrId.bookingId || bookingObjOrId.id) : bookingObjOrId;
            const fullBooking = typeof bookingObjOrId === 'object' ? bookingObjOrId : null;

            // Call the API directly (DB-based)
            if (bookingId) {
                const res = await fetch(`https://localhost:7208/api/Booking/${bookingId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify('Completed')
                });
                
                if (res.ok) {
                    console.log("Successfully updated status in DB");
                    alert("Status Updated to Completed in Database! ✅");
                } else {
                    console.error("Failed to complete booking in DB:", res.status);
                    alert("Failed to update status in Database. Please ensure your Backend is running.");
                }
            } else {
                alert("Error: Could not find Booking ID.");
            }

            if (role === 'Admin') {
                const laundryId = fullBooking?.laundryId || 1;
                const userId = fullBooking?.userId || 101;
                triggerRatingPrompt(bookingId, laundryId, userId, `User #${userId}`, 'Admin');
            }
            
            return true;
        } catch (error) {
            console.error("Completion failed:", error);
            return false;
        }
    };

    const triggerRatingPrompt = (bookingId, laundryId, userId, targetName, targetRole) => {
        const storageKey = targetRole === 'Admin' ? 'prompted_admin_bookings' : 'prompted_bookings';
        const alreadyPrompted = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!alreadyPrompted.includes(bookingId)) {
            localStorage.setItem(storageKey, JSON.stringify([...alreadyPrompted, bookingId]));
            setPendingRatingPrompt({
                bookingId,
                laundryId,
                userId,
                targetName,
                role: targetRole
            });
        }
    };

    const login = (email, password) => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
            setRole('Admin');
            localStorage.setItem('role', 'Admin');
            return 'Admin';
        }
        setRole('User');
        localStorage.setItem('role', 'User');
        return 'User';
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem('role');
        localStorage.removeItem('user_email');
    };

    return (
        <BookingContext.Provider value={{
            role, login, logout,
            bookingData, updateBooking, resetBooking,
            cart, addToCart, removeFromCart,
            reservations, createBooking, cancelBooking, completeBooking,
            ratings, addRating,
            activeNotification, triggerRatingPrompt
        }}>
            {children}
            
            {/* Global Rating Modal */}
            {pendingRatingPrompt && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, animation: 'fadeIn 0.3s ease' }}>
                    <div className="card" style={{ width: '450px', padding: '2.5rem', borderRadius: '24px', animation: 'slideUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center' }}>Job Completed!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                            {pendingRatingPrompt.role === 'Admin' ? 'How was your experience with ' : 'How was your service at '}
                            <strong>{pendingRatingPrompt.targetName}</strong>?
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '2.5rem', marginBottom: '2rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                    key={star} 
                                    onClick={() => setPendingRatingPrompt(prev => ({ ...prev, rating: star }))}
                                    style={{ cursor: 'pointer', color: star <= (pendingRatingPrompt.rating || 5) ? '#fbbf24' : '#e5e7eb', transition: 'color 0.2s' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <textarea 
                            className="input-control" 
                            placeholder="Add a comment (optional)..."
                            value={pendingRatingPrompt.comment || ''}
                            onChange={(e) => setPendingRatingPrompt(prev => ({ ...prev, comment: e.target.value }))}
                            style={{ height: '100px', marginBottom: '2rem', resize: 'none' }}
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPendingRatingPrompt(null)}>Skip</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                                addRating({
                                    UserId: pendingRatingPrompt.userId || 101,
                                    LaundryId: pendingRatingPrompt.laundryId,
                                    BookingId: parseInt(pendingRatingPrompt.bookingId) || null,
                                    Stars: pendingRatingPrompt.rating || 5,
                                    Comment: pendingRatingPrompt.comment || '',
                                    LaundryName: pendingRatingPrompt.targetName
                                });
                                setPendingRatingPrompt(null);
                            }}>Submit Feedback</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Notification Popup */}
            {activeNotification && (
                <div 
                    className="popup-notification slide-in" 
                    onClick={() => {
                        if (activeNotification.ratingActionData) {
                            const bId = activeNotification.ratingActionData.bookingId;
                            const alreadyPrompted = JSON.parse(localStorage.getItem('prompted_bookings') || '[]');
                            if (!alreadyPrompted.includes(bId)) {
                                localStorage.setItem('prompted_bookings', JSON.stringify([...alreadyPrompted, bId]));
                                setPendingRatingPrompt(activeNotification.ratingActionData);
                            }
                            setActiveNotification(null);
                        }
                    }}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '320px',
                        background: 'white',
                        padding: '20px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        border: '2px solid var(--primary)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        animation: 'slideUp 0.4s ease',
                        cursor: activeNotification.ratingActionData ? 'pointer' : 'default'
                    }}
                >
                    <div style={{ fontSize: '2rem' }}>🔔</div>
                    <div>
                        <strong style={{ display: 'block', color: 'var(--primary)', fontSize: '1rem' }}>{activeNotification.title}</strong>
                        <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeNotification.message}</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </BookingContext.Provider>
    );
};
