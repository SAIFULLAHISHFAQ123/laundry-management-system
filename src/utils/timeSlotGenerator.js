// Helper to convert "8:30 AM" to minutes
const timeToMins = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12 && modifier === 'AM') hours = 0;
    if (hours < 12 && modifier === 'PM') hours += 12;
    return hours * 60 + minutes;
};

export const generateTimeSlots = (basePrice = 500, durationMins = 30, machineId, selectedDate, existingReservations = []) => {
    const slots = [];
    let currentMins = 8 * 60; // 8:00 AM in minutes
    const endMins = 21 * 60; // 9:00 PM in minutes

    // Filter reservations for this specific date
    const dateReservations = existingReservations.filter(res =>
        res.date === selectedDate &&
        res.status !== 'Cancelled'
    );

    while (currentMins + durationMins <= endMins) {
        const h = Math.floor(currentMins / 60);
        const m = currentMins % 60;

        // Format time string
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        const displayM = m.toString().padStart(2, '0');
        const time = `${displayH}:${displayM} ${ampm}`;

        const currentSlotStart = currentMins;
        const currentSlotEnd = currentMins + durationMins;

        // Check if this time slot is already booked for THIS specific machine
        const isBooked = dateReservations.some(res => {
            if (!res.timeSlots) return false;

            // Get the duration of this specific reservation
            const resDuration = parseInt(res.clothType?.durationMinutes || '30');

            return res.timeSlots.some(slot => {
                if (slot.machineId !== machineId) return false;

                const resStart = timeToMins(slot.time);
                const resEnd = resStart + resDuration;

                // Check for overlap: Overlap occurs if (StartA < EndB) and (StartB < EndA)
                return (resStart < currentSlotEnd) && (currentSlotStart < resEnd);
            });
        });

        slots.push({
            time,
            price: 0,
            status: isBooked ? 'Booked' : 'Available',
            availableUnits: isBooked ? 0 : 1 // Only 1 unit per machine instance
        });

        currentMins += durationMins;
    }
    return slots;
};
