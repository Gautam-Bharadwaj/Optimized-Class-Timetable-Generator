const ConflictIndicator = ({ slots }) => {
    const detectConflicts = () => {
        const conflicts = [];

        for (let i = 0; i < slots.length; i++) {
            for (let j = i + 1; j < slots.length; j++) {
                const slot1 = slots[i];
                const slot2 = slots[j];

                // Same time and day
                if (
                    slot1.dayOfWeek === slot2.dayOfWeek &&
                    slot1.startTime === slot2.startTime
                ) {
                    // Faculty conflict
                    if (slot1.facultyId === slot2.facultyId) {
                        conflicts.push({
                            type: 'faculty',
                            slot1,
                            slot2,
                            message: `Faculty #${slot1.facultyId} is scheduled in multiple classes at the same time`,
                        });
                    }

                    // Classroom conflict
                    if (slot1.classroomId === slot2.classroomId) {
                        conflicts.push({
                            type: 'classroom',
                            slot1,
                            slot2,
                            message: `Classroom #${slot1.classroomId} is double-booked`,
                        });
                    }
                }
            }
        }

        return conflicts;
    };

    const conflicts = detectConflicts();

    if (conflicts.length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                    <span className="text-2xl">✓</span>
                    <div>
                        <h4 className="font-semibold">No Conflicts Detected</h4>
                        <p className="text-sm">This timetable has no scheduling conflicts.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 mb-3">
                <span className="text-2xl">⚠️</span>
                <div>
                    <h4 className="font-semibold">{conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected</h4>
                    <p className="text-sm">The following scheduling conflicts need attention:</p>
                </div>
            </div>

            <div className="space-y-2 mt-3">
                {conflicts.map((conflict, index) => (
                    <div
                        key={index}
                        className="bg-white border border-red-200 rounded-lg p-3 text-sm"
                    >
                        <div className="flex items-start gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${conflict.type === 'faculty'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-100 text-purple-800'
                                }`}>
                                {conflict.type === 'faculty' ? '👨‍🏫 Faculty' : '🏫 Classroom'}
                            </span>
                            <div className="flex-1">
                                <p className="text-gray-800 font-medium">{conflict.message}</p>
                                <p className="text-gray-600 text-xs mt-1">
                                    {conflict.slot1.dayOfWeek} at {conflict.slot1.startTime} - {conflict.slot1.endTime}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConflictIndicator;
