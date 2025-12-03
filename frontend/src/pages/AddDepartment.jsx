import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentApi } from '../api/department.api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';

const AddDepartment = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', hod: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                code: formData.code,
                headOfDepartment: formData.hod
            };

            await departmentApi.create(payload);
            navigate('/dashboard/departments');
        } catch (error) {
            console.error("Failed to save department", error);
            alert("Failed to save department");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/departments')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Department</h1>
                    <p className="text-gray-600">Create a new academic department</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Department Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Computer Science"
                        required
                    />
                    <Input
                        label="Department Code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., CSE"
                        required
                    />
                    <Input
                        label="Head of Department"
                        value={formData.hod}
                        onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                        placeholder="e.g., Dr. Smith"
                        required
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/departments')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Department'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartment;
