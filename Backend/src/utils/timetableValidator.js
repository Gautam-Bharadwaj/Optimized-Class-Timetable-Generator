module.exports = (slots) => {
    const errors = [];
    const facultyMap = new Map();
    const roomMap = new Map();

    slots.forEach((slot, index) => {
        const timeKey = `${slot.dayOfWeek}-${slot.startTime}`;

        // Check Faculty Conflict
        const facultyKey = `${timeKey}-F${slot.facultyId}`;
        if (facultyMap.has(facultyKey)) {
            errors.push(`Faculty ${slot.facultyId} double booked at ${timeKey}`);
        }
        facultyMap.set(facultyKey, index);

        // Check Room Conflict
        const roomKey = `${timeKey}-R${slot.classroomId}`;
        if (roomMap.has(roomKey)) {
            errors.push(`Classroom ${slot.classroomId} double booked at ${timeKey}`);
        }
        roomMap.set(roomKey, index);
    });

    return {
        valid: errors.length === 0,
        errors
    };
};
