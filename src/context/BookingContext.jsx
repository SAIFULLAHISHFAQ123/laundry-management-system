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
            numLoads: 1,
            detergent: null,
            machine: null,
            isQueued: false,
            estimatedArrival: null
        });
    };

    const addToCart = () => {
        const slotsPrice = (bookingData.timeSlots || []).reduce((sum, slot) => sum + (slot.price || 0), 0);
        const newItem = {
            id: Date.now(),
            ...bookingData,
            totalPrice: slotsPrice + 
                        ((bookingData.clothType?.price || 0) * (bookingData.numLoads || 1)) + 
                        (bookingData.detergent?.price || 0)
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

    const cancelBooking = (bookingId) => {
        setReservations(prev => prev.map(res => 
            res.bookingId === bookingId ? { ...res, status: 'Cancelled' } : res
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
            reservations, createBooking, cancelBooking
        }}>
            {children}
        </BookingContext.Provider>
    );
};
