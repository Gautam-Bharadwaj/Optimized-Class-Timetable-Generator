import { useState } from 'react';
import Input from '../../../components/ui/Input';

const TimetableFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({});

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value || undefined };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        onFilterChange({});
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                    label="Search"
                    placeholder="Search..."
                    value={filters.searchTerm || ''}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faculty ID
                    </label>
                    <input
                        type="number"
                        placeholder="Filter by faculty"
                        value={filters.facultyId || ''}
                        onChange={(e) => handleFilterChange('facultyId', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Classroom ID
                    </label>
                    <input
                        type="number"
                        placeholder="Filter by classroom"
                        value={filters.classroomId || ''}
                        onChange={(e) => handleFilterChange('classroomId', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject ID
                    </label>
                    <input
                        type="number"
                        placeholder="Filter by subject"
                        value={filters.subjectId || ''}
                        onChange={(e) => handleFilterChange('subjectId', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value) return null;
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {key}: {value}
                                <button
                                    onClick={() => handleFilterChange(key, undefined)}
                                    className="ml-1 hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TimetableFilters;
