const ComparisonMetrics = ({ timetables }) => {
    const getMetric = (timetable, key) => {
        return timetable.scoreJson?.[key] || 0;
    };

    const metrics = [
        { key: 'overall', label: 'Overall Score', unit: '%', color: 'blue' },
        { key: 'conflicts', label: 'Conflicts', unit: '', color: 'red', inverse: true },
        { key: 'facultyLoad', label: 'Faculty Load Balance', unit: '%', color: 'green' },
        { key: 'roomUtilization', label: 'Room Utilization', unit: '%', color: 'purple' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Comparison Metrics</h3>

            <div className="space-y-4">
                {metrics.map((metric) => (
                    <div key={metric.key} className="border-b border-gray-200 pb-3 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{metric.label}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {timetables.map((timetable, index) => {
                                const value = getMetric(timetable, metric.key);
                                const isHighest = !metric.inverse && value === Math.max(...timetables.map(t => getMetric(t, metric.key)));
                                const isLowest = metric.inverse && value === Math.min(...timetables.map(t => getMetric(t, metric.key)));
                                const isBest = isHighest || isLowest;

                                return (
                                    <div
                                        key={timetable.id}
                                        className={`p-3 rounded-lg border-2 ${isBest
                                            ? `border-${metric.color}-500 bg-${metric.color}-50`
                                            : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-xs text-gray-600 mb-1">Option {index + 1}</div>
                                        <div className="text-2xl font-bold text-gray-800">
                                            {value}
                                            {metric.unit}
                                        </div>
                                        {isBest && (
                                            <div className="text-xs text-green-600 font-medium mt-1">✓ Best</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Recommendation</h4>
                <div className="text-sm text-gray-600">
                    {timetables.length > 0 && (
                        <p>
                            Based on overall scores, <span className="font-semibold text-blue-600">
                                Option {timetables.findIndex(t => getMetric(t, 'overall') === Math.max(...timetables.map(tt => getMetric(tt, 'overall')))) + 1}
                            </span> appears to be the best choice.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonMetrics;
