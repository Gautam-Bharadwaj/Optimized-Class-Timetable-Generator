import { DayOfWeek } from '../../../types/types';

const TimetableHeader = ({ days, showWeekend = false }) => {
    const displayDays = showWeekend
        ? [...days, DayOfWeek.SATURDAY]
        : days.filter((day) => day !== DayOfWeek.SATURDAY);

    return (
        <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="border border-blue-500 px-4 py-3 font-semibold text-left sticky left-0 bg-blue-600 z-10">
                    Time
                </th>
                {displayDays.map((day) => (
                    <th
                        key={day}
                        className="border border-blue-500 px-4 py-3 font-semibold text-center min-w-[180px]"
                    >
                        {day}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TimetableHeader;
