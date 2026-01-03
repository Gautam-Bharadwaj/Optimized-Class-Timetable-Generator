import React from 'react';

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const TIME_SLOTS = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
    "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
];

const TimetableGrid = ({ slots }) => {
    // Map slots to a coordinate system [day][time]
    const grid = {};
    DAYS.forEach(day => {
        grid[day] = {};
        TIME_SLOTS.forEach(slot => {
            grid[day][slot] = null;
        });
    });

    slots.forEach(slot => {
        const key = `${slot.startTime}-${slot.endTime}`;
        if (grid[slot.dayOfWeek] && grid[slot.dayOfWeek].hasOwnProperty(key)) {
            grid[slot.dayOfWeek][key] = slot;
        }
    });

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 bg-slate-100/50 sticky left-0 z-10 min-w-[120px]">
                            Time / Day
                        </th>
                        {DAYS.map(day => (
                            <th key={day} className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[180px]">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {TIME_SLOTS.map(time => (
                        <tr key={time} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 text-sm font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10 glass">
                                {time}
                            </td>
                            {DAYS.map(day => {
                                const slot = grid[day][time];
                                return (
                                    <td key={`${day}-${time}`} className="p-2 h-24">
                                        {slot ? (
                                            <div className="h-full w-full p-3 rounded-lg bg-blue-50 border border-blue-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.02] transition-all cursor-default group/card">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                                                            {slot.subject?.code || `Sub ID: ${slot.subjectId}`}
                                                        </span>
                                                        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-500">
                                                            {slot.classroom?.name || `Rm ${slot.classroomId}`}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">
                                                        {slot.subject?.name || 'Unknown Subject'}
                                                    </div>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-blue-100/50 flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                                        {slot.faculty?.name?.charAt(0) || 'F'}
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-500 truncate">
                                                        {slot.faculty?.name || 'TBD'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full w-full rounded-lg border-2 border-dashed border-slate-50 group-hover:border-slate-100 transition-colors" />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimetableGrid;
