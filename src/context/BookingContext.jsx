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
        estimatedArrival: null
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
        resetBooking();
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

    const completeBooking = (bookingId) => {
        setReservations(prev => prev.map(res => 
            res.bookingId === bookingId ? { ...res, status: 'Completed' } : res
        ));
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
            reservations, createBooking, cancelBooking, completeBooking
        }}>
            {children}
        </BookingContext.Provider>
    );
};
