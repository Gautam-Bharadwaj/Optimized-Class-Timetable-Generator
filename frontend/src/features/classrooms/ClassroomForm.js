import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ClassroomType } from '../../types/types';

const ClassroomForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        capacity: 60,
        type: ClassroomType.LECTURE,
        departmentId: 1,
        year: undefined,
        semester: undefined,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                capacity: initialData.capacity,
                type: initialData.type,
                departmentId: initialData.departmentId,
                year: initialData.year,
                semester: initialData.semester,
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Classroom Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., CSE-Lab-1"
                required
            />
            <Input
                label="Capacity *"
                type="number"
                value={formData.capacity.toString()}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
                min="1"
                max="500"
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                </label>
                <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    {Object.values(ClassroomType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <Input
                label="Department ID *"
                type="number"
                value={formData.departmentId.toString()}
                onChange={(e) => handleChange('departmentId', parseInt(e.target.value))}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Year"
                    type="number"
                    value={formData.year?.toString() || ''}
                    onChange={(e) => handleChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    max="5"
                />
                <Input
                    label="Semester"
                    type="number"
                    value={formData.semester?.toString() || ''}
                    onChange={(e) => handleChange('semester', e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    max="10"
                />
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

export default ClassroomForm;
