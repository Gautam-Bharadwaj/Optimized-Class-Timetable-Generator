import { useState } from 'react';
import { TimetableSlot } from '../timetable.types';
import { DayOfWeek } from '../../../types/types';
import TimetableHeader from './TimetableHeader';
import TimetableCell from './TimetableCell';

interface TimetableGridProps {
    slots: TimetableSlot[];
    onSlotClick?: (slot: TimetableSlot) => void;
    showWeekend?: boolean;
    highlightConflicts?: boolean;
}

const TimetableGrid = ({
    slots,
    onSlotClick,
    showWeekend = false,
    highlightConflicts = true,
}: TimetableGridProps) => {
    const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

    const days = [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
    ];

    // Group slots by day and time
    const slotsByDay: Record<string, TimetableSlot[]> = {};
    slots.forEach((slot) => {
        if (!slotsByDay[slot.dayOfWeek]) {
            slotsByDay[slot.dayOfWeek] = [];
        }
        slotsByDay[slot.dayOfWeek].push(slot);
    });

    // Get unique time slots
    const timeSlots = Array.from(
        new Set(slots.map((slot) => `${slot.startTime}-${slot.endTime}`))
    ).sort();

    // Detect conflicts (same faculty/room at same time)
    const detectConflict = (slot: TimetableSlot): boolean => {
        if (!highlightConflicts) return false;

        return slots.some(
            (s) =>
                s.id !== slot.id &&
                s.dayOfWeek === slot.dayOfWeek &&
                s.startTime === slot.startTime &&
                (s.facultyId === slot.facultyId || s.classroomId === slot.classroomId)
        );
    };

    const handleSlotClick = (slot: TimetableSlot) => {
        setSelectedSlot(slot);
        onSlotClick?.(slot);
    };

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full border-collapse border border-gray-300 bg-white">
                <TimetableHeader days={days} showWeekend={showWeekend} />
                <tbody>
                    {timeSlots.map((timeSlot) => (
                        <tr key={timeSlot} className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-300 px-4 py-3 font-medium bg-gray-100 whitespace-nowrap sticky left-0 z-10">
                                <div className="text-sm text-gray-700">{timeSlot}</div>
                            </td>
                            {days.map((day) => {
                                const slot = slotsByDay[day]?.find(
                                    (s) => `${s.startTime}-${s.endTime}` === timeSlot
                                );
                                const hasConflict = slot ? detectConflict(slot) : false;

                                return (
                                    <TimetableCell
                                        key={day}
                                        slot={slot}
                                        hasConflict={hasConflict}
                                        onClick={() => slot && handleSlotClick(slot)}
                                    />
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Selected Slot Details Modal */}
            {selectedSlot && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedSlot(null)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Slot Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Day:</span>
                                <span className="text-gray-800">{selectedSlot.dayOfWeek}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Time:</span>
                                <span className="text-gray-800">
                                    {selectedSlot.startTime} - {selectedSlot.endTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Subject ID:</span>
                                <span className="text-gray-800">{selectedSlot.subjectId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Faculty ID:</span>
                                <span className="text-gray-800">{selectedSlot.facultyId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Classroom ID:</span>
                                <span className="text-gray-800">{selectedSlot.classroomId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Fixed:</span>
                                <span className="text-gray-800">{selectedSlot.isFixed ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedSlot(null)}
                            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableGrid;
