import { useState, useEffect } from 'react';
import { classroomApi } from '../features/classrooms/classroom.api';
import { departmentApi } from '../features/departments/department.api';
import TableView from '../components/TableView';
import Loader from '../components/Loader';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

const ClassroomPage = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        year: '',
        semester: '',
        departmentId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classroomData, deptData] = await Promise.all([
                    classroomApi.getAll(),
                    departmentApi.getAll()
                ]);
                setClassrooms(classroomData);
                setDepartments(deptData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const data = await classroomApi.getAll();
            setClassrooms(data);
        } catch (error) {
            console.error("Failed to fetch classrooms", error);
        }
    };

    const columns = [
        { key: 'name', header: 'Classroom Name' },
        { key: 'year', header: 'Year' },
        { key: 'semester', header: 'Semester' },
        {
            key: 'department',
            header: 'Department',
            render: (value, row) => row.department?.code || '-'
        }
    ];

    const handleEdit = (row) => {
        setEditingId(row.id);
        setFormData({
            name: row.name,
            year: row.year,
            semester: row.semester,
            departmentId: row.departmentId,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            try {
                await classroomApi.delete(row.id);
                fetchClassrooms();
            } catch (error) {
                console.error("Failed to delete classroom", error);
                alert("Failed to delete classroom");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                semester: parseInt(formData.semester),
                departmentId: parseInt(formData.departmentId)
            };

            if (editingId) {
                await classroomApi.update(editingId, payload);
            } else {
                await classroomApi.create(payload);
            }

            handleCloseModal();
            fetchClassrooms();
        } catch (error) {
            console.error("Failed to save classroom", error);
            alert("Failed to save classroom");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            year: '',
            semester: '',
            departmentId: '',
        });
        setEditingId(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Classrooms</h1>
                    <p className="text-gray-600">Manage classrooms and laboratories</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Classroom
                </Button>
            </div>

            <TableView
                columns={columns}
                data={classrooms}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Edit Classroom" : "Add New Classroom"}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? 'Update' : 'Save')}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Classroom Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., CSE-Lab-1"
                        required
                    />
                    <Input
                        label="Year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="e.g., 2"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                            ))}
                        </select>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassroomPage;
