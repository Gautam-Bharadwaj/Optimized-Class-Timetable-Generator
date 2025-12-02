import TimetableGrid from './TimetableGrid';
import ComparisonMetrics from './ComparisonMetrics';

const TimetableComparison = ({ timetables, onSelect }) => {
    if (timetables.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No timetables to compare
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Metrics Comparison */}
            <ComparisonMetrics timetables={timetables} />

            {/* Side-by-side Timetables */}
            <div className="space-y-6">
                {timetables.map((timetable, index) => (
                    <div key={timetable.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Option {index + 1}: {timetable.name}
                                </h3>
                                <div className="flex gap-4 mt-1 text-sm">
                                    <span className={`px-2 py-1 rounded ${timetable.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-800'
                                        : timetable.status === 'REJECTED'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {timetable.status}
                                    </span>
                                    {timetable.scoreJson?.overall && (
                                        <span className="text-gray-600">
                                            Score: <span className="font-semibold">{timetable.scoreJson.overall}%</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {onSelect && (
                                <button
                                    onClick={() => onSelect(timetable)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Select This
                                </button>
                            )}
                        </div>

                        <TimetableGrid slots={timetable.slots} highlightConflicts={true} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetableComparison;
