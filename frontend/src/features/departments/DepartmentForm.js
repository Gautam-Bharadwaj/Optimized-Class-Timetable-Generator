import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const DepartmentForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        headOfDepartment: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                headOfDepartment: initialData.headOfDepartment || '',
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
                label="Department Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Computer Science & Engineering"
                required
            />
            <Input
                label="Department Code *"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="e.g., CSE"
                required
            />
            <Input
                label="Head of Department"
                value={formData.headOfDepartment}
                onChange={(e) => handleChange('headOfDepartment', e.target.value)}
                placeholder="e.g., Dr. John Doe"
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

export default DepartmentForm;
