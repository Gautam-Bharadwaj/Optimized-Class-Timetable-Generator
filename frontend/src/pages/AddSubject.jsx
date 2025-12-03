import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectApi } from '../api/subject.api';
import { departmentApi } from '../api/department.api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';

const AddSubject = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        departmentId: '',
        credits: '',
        semester: '',
        type: 'THEORY',
        lecturesPerWeek: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await departmentApi.getAll();
            setDepartments(data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                departmentId: parseInt(formData.departmentId),
                credits: parseInt(formData.credits),
                semester: parseInt(formData.semester),
                lecturesPerWeek: parseInt(formData.lecturesPerWeek)
            };

            await subjectApi.create(payload);
            navigate('/dashboard/subjects');
        } catch (error) {
            console.error("Failed to save subject", error);
            alert("Failed to save subject");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/subjects')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Subject</h1>
                    <p className="text-gray-600">Create a new course/subject</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Subject Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Data Structures"
                        required
                    />
                    <Input
                        label="Subject Code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., CS201"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name} ({dept.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Credits"
                            type="number"
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                            placeholder="e.g., 4"
                            required
                        />
                        <Input
                            label="Semester"
                            type="number"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            placeholder="e.g., 3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="THEORY">Theory</option>
                                <option value="LAB">Lab</option>
                            </select>
                        </div>
                        <Input
                            label="Lectures Per Week"
                            type="number"
                            value={formData.lecturesPerWeek}
                            onChange={(e) => setFormData({ ...formData, lecturesPerWeek: e.target.value })}
                            placeholder="e.g., 3"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/subjects')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Subject'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubject;
