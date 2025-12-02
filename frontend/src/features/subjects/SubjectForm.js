import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { SubjectType } from '../../types/types';

const SubjectForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        departmentId: 1,
        credits: 4,
        type: SubjectType.LECTURE,
        lecturesPerWeek: 3,
        labsPerWeek: 0,
        semester: 1,
        durationPerClass: 60,
        allowedRoomTypes: [],
        prerequisites: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                name: initialData.name,
                departmentId: initialData.departmentId,
                credits: initialData.credits,
                type: initialData.type,
                lecturesPerWeek: initialData.lecturesPerWeek,
                labsPerWeek: initialData.labsPerWeek,
                semester: initialData.semester,
                durationPerClass: initialData.durationPerClass,
                allowedRoomTypes: initialData.allowedRoomTypes || [],
                prerequisites: initialData.prerequisites || [],
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
                label="Subject Code *"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="e.g., CS101"
                required
            />
            <Input
                label="Subject Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Data Structures"
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Department ID *"
                    type="number"
                    value={formData.departmentId.toString()}
                    onChange={(e) => handleChange('departmentId', parseInt(e.target.value))}
                    required
                />
                <Input
                    label="Credits *"
                    type="number"
                    value={formData.credits.toString()}
                    onChange={(e) => handleChange('credits', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    required
                />
            </div>

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
                    {Object.values(SubjectType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Input
                    label="Lectures/Week *"
                    type="number"
                    value={formData.lecturesPerWeek.toString()}
                    onChange={(e) => handleChange('lecturesPerWeek', parseInt(e.target.value))}
                    min="0"
                    max="10"
                    required
                />
                <Input
                    label="Labs/Week"
                    type="number"
                    value={formData.labsPerWeek?.toString() || '0'}
                    onChange={(e) => handleChange('labsPerWeek', parseInt(e.target.value))}
                    min="0"
                    max="10"
                />
                <Input
                    label="Semester *"
                    type="number"
                    value={formData.semester.toString()}
                    onChange={(e) => handleChange('semester', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    required
                />
            </div>

            <Input
                label="Duration Per Class (minutes) *"
                type="number"
                value={formData.durationPerClass.toString()}
                onChange={(e) => handleChange('durationPerClass', parseInt(e.target.value))}
                min="30"
                max="180"
                required
            />

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

export default SubjectForm;
