const TimetableCell = ({ slot, hasConflict, onClick }) => {
    if (!slot) {
        return (
            <td className="border border-gray-300 px-2 py-3 bg-gray-50">
                <div className="text-center text-gray-400 text-sm">-</div>
            </td>
        );
    }

    return (
        <td
            className={`border border-gray-300 px-2 py-3 cursor-pointer transition-all hover:shadow-md ${hasConflict ? 'bg-red-50 border-red-300' : 'bg-white hover:bg-blue-50'
                } ${slot.isFixed ? 'bg-orange-50' : ''}`}
            onClick={onClick}
        >
            <div className="text-sm space-y-1">
                <div className="font-semibold text-blue-700 truncate" title={`Subject #${slot.subjectId}`}>
                    Subject #{slot.subjectId}
                </div>
                <div className="text-gray-600 text-xs truncate" title={`Faculty #${slot.facultyId}`}>
                    👨‍🏫 Faculty #{slot.facultyId}
                </div>
                <div className="text-gray-500 text-xs truncate" title={`Room #${slot.classroomId}`}>
                    🏫 Room #{slot.classroomId}
                </div>
                <div className="flex gap-1 mt-1">
                    {slot.isFixed && (
                        <span className="inline-block px-1 py-0.5 bg-orange-200 text-orange-800 text-xs rounded">
                            📌 Fixed
                        </span>
                    )}
                    {hasConflict && (
                        <span className="inline-block px-1 py-0.5 bg-red-200 text-red-800 text-xs rounded">
                            ⚠️ Conflict
                        </span>
                    )}
                </div>
            </div>
        </td>
    );
};

export default TimetableCell;
