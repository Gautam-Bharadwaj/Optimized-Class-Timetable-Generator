import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classroomApi } from '../api/classroom.api';
import { departmentApi } from '../api/department.api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';

const AddClassroom = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        roomId: '',
        capacity: '',
        departmentId: '',
        type: 'LECTURE_HALL',
        facilities: ''
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
                capacity: parseInt(formData.capacity),
                departmentId: parseInt(formData.departmentId),
                facilities: formData.facilities.split(',').map(f => f.trim()).filter(Boolean)
            };

            await classroomApi.create(payload);
            navigate('/dashboard/classrooms');
        } catch (error) {
            console.error("Failed to save classroom", error);
            const message = error.response?.data?.message || error.message || "Failed to save classroom";
            alert(`Error: ${message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/classrooms')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Classroom</h1>
                    <p className="text-gray-600">Register a new classroom or lab</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Room ID/Number"
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        placeholder="e.g., A-101"
                        required
                    />
                    <Input
                        label="Capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="e.g., 60"
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
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LABORATORY">Laboratory</option>
                            <option value="SEMINAR_HALL">Seminar Hall</option>
                        </select>
                    </div>

                    <Input
                        label="Facilities (comma separated)"
                        value={formData.facilities}
                        onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                        placeholder="e.g., Projector, Whiteboard, AC"
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/classrooms')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Classroom'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClassroom;
