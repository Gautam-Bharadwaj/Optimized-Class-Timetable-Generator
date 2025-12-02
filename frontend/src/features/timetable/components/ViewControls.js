const ViewControls = ({
    viewMode,
    onViewModeChange,
    showWeekend,
    onShowWeekendChange,
    highlightConflicts,
    onHighlightConflictsChange,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-4 items-center">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">View:</span>
                    <div className="inline-flex rounded-lg border border-gray-300">
                        <button
                            onClick={() => onViewModeChange('week')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${viewMode === 'week'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => onViewModeChange('day')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${viewMode === 'day'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Day
                        </button>
                    </div>
                </div>

                {/* Show Weekend Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showWeekend}
                        onChange={(e) => onShowWeekendChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Weekend</span>
                </label>

                {/* Highlight Conflicts Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={highlightConflicts}
                        onChange={(e) => onHighlightConflictsChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Highlight Conflicts</span>
                </label>

                {/* Legend */}
                <div className="ml-auto flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
                        <span className="text-gray-600">Fixed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-50 border border-red-300 rounded"></div>
                        <span className="text-gray-600">Conflict</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewControls;
