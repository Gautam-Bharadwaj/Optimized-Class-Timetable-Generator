import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TimetableGrid from './components/TimetableGrid';
import ViewControls from './components/ViewControls';
import TimetableFilters from './components/TimetableFilters';
import ConflictIndicator from './components/ConflictIndicator';

const TimetableViewer = ({ timetable, onApprove, onReject, onExport }) => {
    const [viewMode, setViewMode] = useState('week');
    const [showWeekend, setShowWeekend] = useState(false);
    const [highlightConflicts, setHighlightConflicts] = useState(true);
    const [filters, setFilters] = useState({});

    // Apply filters to slots
    const filteredSlots = timetable.slots.filter((slot) => {
        if (filters.facultyId && slot.facultyId !== filters.facultyId) return false;
        if (filters.classroomId && slot.classroomId !== filters.classroomId) return false;
        if (filters.subjectId && slot.subjectId !== filters.subjectId) return false;
        if (filters.dayOfWeek && slot.dayOfWeek !== filters.dayOfWeek) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card
                title={timetable.name}
                actions={
                    <div className="flex gap-2">
                        {onExport && (
                            <>
                                <Button size="sm" variant="secondary" onClick={() => onExport('pdf')}>
                                    📄 PDF
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => onExport('csv')}>
                                    📊 CSV
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => onExport('ical')}>
                                    📅 iCal
                                </Button>
                            </>
                        )}
                        {onReject && (
                            <Button size="sm" variant="danger" onClick={onReject}>
                                Reject
                            </Button>
                        )}
                        {onApprove && (
                            <Button size="sm" variant="success" onClick={onApprove}>
                                Approve
                            </Button>
                        )}
                    </div>
                }
            >
                <div className="flex gap-6 text-sm">
                    <div>
                        <span className="font-medium text-gray-600">Status:</span>{' '}
                        <span
                            className={`px-2 py-1 rounded text-xs ml-1 ${timetable.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : timetable.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                        >
                            {timetable.status}
                        </span>
                    </div>
                    {timetable.scoreJson && (
                        <>
                            <div>
                                <span className="font-medium text-gray-600">Overall Score:</span>{' '}
                                <span className="font-bold text-blue-600">{timetable.scoreJson.overall || 'N/A'}%</span>
                            </div>
                            {timetable.scoreJson.conflicts !== undefined && (
                                <div>
                                    <span className="font-medium text-gray-600">Conflicts:</span>{' '}
                                    <span className={`font-bold ${timetable.scoreJson.conflicts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {timetable.scoreJson.conflicts}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                    <div>
                        <span className="font-medium text-gray-600">Total Slots:</span>{' '}
                        <span className="text-gray-800">{timetable.slots.length}</span>
                    </div>
                </div>
            </Card>

            {/* Conflict Indicator */}
            <ConflictIndicator slots={filteredSlots} />

            {/* View Controls */}
            <ViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showWeekend={showWeekend}
                onShowWeekendChange={setShowWeekend}
                highlightConflicts={highlightConflicts}
                onHighlightConflictsChange={setHighlightConflicts}
            />

            {/* Filters */}
            <TimetableFilters onFilterChange={setFilters} />

            {/* Timetable Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {viewMode === 'week' ? 'Weekly Schedule' : 'Daily Schedule'}
                </h3>
                <TimetableGrid
                    slots={filteredSlots}
                    showWeekend={showWeekend}
                    highlightConflicts={highlightConflicts}
                />
            </div>
        </div>
    );
};

export default TimetableViewer;
