export const generateTimeSlots = (basePrice = 500) => {
    const slots = [];
    const startHour = 8;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let min of ['00', '30']) {
            const time = `${hour}:${min} ${hour >= 12 ? 'PM' : 'AM'}`;
            // Peak hours = 5 PM to 9 PM
            const isPeak = hour >= 17 && hour <= 21;
            const price = isPeak ? basePrice + 100 : basePrice;
            
            slots.push({
                time,
                isPeak,
                price,
                status: Math.random() > 0.8 ? 'Booked' : 'Available',
                availableUnits: Math.floor(Math.random() * 5 + 1)
            });
        }
    }
    return slots;
};
