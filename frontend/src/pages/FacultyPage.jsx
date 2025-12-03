import { useState, useEffect } from 'react';
import { facultyApi } from '../features/faculty/faculty.api';
import { departmentApi } from '../features/departments/department.api';
import TableView from '../components/TableView';
import Loader from '../components/Loader';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

const FacultyPage = () => {
    const [faculty, setFaculty] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        departmentId: '',
        maxWeeklyLoad: '',
        availableDays: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultyData, deptData] = await Promise.all([
                    facultyApi.getAll(),
                    departmentApi.getAll()
                ]);
                setFaculty(facultyData);
                setDepartments(deptData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchFaculty = async () => {
        try {
            const data = await facultyApi.getAll();
            setFaculty(data);
        } catch (error) {
            console.error("Failed to fetch faculty", error);
        }
    };

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        {
            key: 'department',
            header: 'Department',
            render: (value, row) => row.department?.code || '-'
        },
        { key: 'maxWeeklyLoad', header: 'Max Load (hrs)' },
        {
            key: 'subjects',
            header: 'Subjects',
            render: (value, row) => row._count?.subjects || 0
        }
    ];

    const handleEdit = (row) => {
        setEditingId(row.id);
        let days = '';
        try {
            const parsed = JSON.parse(row.availableDays);
            days = Array.isArray(parsed) ? parsed.join(', ') : row.availableDays;
        } catch (e) {
            days = row.availableDays;
        }

        setFormData({
            name: row.name,
            email: row.email,
            departmentId: row.departmentId,
            maxWeeklyLoad: row.maxWeeklyLoad,
            availableDays: days,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            try {
                await facultyApi.delete(row.id);
                fetchFaculty();
            } catch (error) {
                console.error("Failed to delete faculty", error);
                alert("Failed to delete faculty");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const daysArray = formData.availableDays.split(',').map(d => d.trim()).filter(Boolean);
            const payload = {
                ...formData,
                maxWeeklyLoad: parseInt(formData.maxWeeklyLoad),
                departmentId: parseInt(formData.departmentId),
                availableDays: JSON.stringify(daysArray)
            };

            if (editingId) {
                await facultyApi.update(editingId, payload);
            } else {
                await facultyApi.create(payload);
            }

            handleCloseModal();
            fetchFaculty();
        } catch (error) {
            console.error("Failed to save faculty", error);
            alert("Failed to save faculty");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            email: '',
            departmentId: '',
            maxWeeklyLoad: '',
            availableDays: '',
        });
        setEditingId(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Faculty Members</h1>
                    <p className="text-gray-600">Manage faculty and their workload</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Faculty
                </Button>
            </div>

            <TableView
                columns={columns}
                data={faculty}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Edit Faculty" : "Add New Faculty"}
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
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Dr. Alice Brown"
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@college.edu"
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
                    <Input
                        label="Max Weekly Load (hours)"
                        type="number"
                        value={formData.maxWeeklyLoad}
                        onChange={(e) => setFormData({ ...formData, maxWeeklyLoad: e.target.value })}
                        placeholder="e.g., 18"
                        required
                    />
                    <Input
                        label="Available Days (comma-separated)"
                        value={formData.availableDays}
                        onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
                        placeholder="e.g., Monday, Wednesday, Friday"
                    />
                </form>
            </Modal>
        </div>
    );
};

export default FacultyPage;
