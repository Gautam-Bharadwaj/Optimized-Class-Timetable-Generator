import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { DayOfWeek } from '../../types/types';

const FacultyForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        departmentId: 1,
        maxWeeklyLoad: 18,
        averageLeavesPerMonth: 1,
        availableDays: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
        preferredSlots: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone || '',
                departmentId: initialData.departmentId,
                maxWeeklyLoad: initialData.maxWeeklyLoad,
                averageLeavesPerMonth: initialData.averageLeavesPerMonth,
                availableDays: initialData.availableDays,
                preferredSlots: initialData.preferredSlots || [],
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDaysChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        handleChange('availableDays', selectedOptions);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Dr. Alice Brown"
                required
            />
            <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@college.edu"
                required
            />
            <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 1234567890"
            />
            <Input
                label="Department ID *"
                type="number"
                value={formData.departmentId.toString()}
                onChange={(e) => handleChange('departmentId', parseInt(e.target.value))}
                required
            />
            <Input
                label="Max Weekly Load (hours) *"
                type="number"
                value={formData.maxWeeklyLoad.toString()}
                onChange={(e) => handleChange('maxWeeklyLoad', parseInt(e.target.value))}
                min="1"
                max="40"
                required
            />
            <Input
                label="Average Leaves Per Month"
                type="number"
                value={formData.averageLeavesPerMonth?.toString() || '1'}
                onChange={(e) => handleChange('averageLeavesPerMonth', parseInt(e.target.value))}
                min="0"
                max="10"
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Days *
                </label>
                <select
                    multiple
                    value={formData.availableDays}
                    onChange={handleDaysChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={6}
                >
                    {Object.values(DayOfWeek).map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple days</p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
};

export default FacultyForm;
