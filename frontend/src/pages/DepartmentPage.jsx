import { useState, useEffect } from 'react';
import { departmentApi } from '../api/department.api';
import TableView from '../components/TableView';
import Loader from '../components/Loader';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

const DepartmentPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', hod: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await departmentApi.getAll();
            setDepartments(data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'code', header: 'Code' },
        { key: 'name', header: 'Department Name' },
        {
            key: 'headOfDepartment',
            header: 'Head of Department',
            render: (val) => val || '-'
        },
        {
            key: 'facultyCount',
            header: 'Faculty',
            render: (value, row) => row._count?.faculties || 0
        },
        {
            key: 'studentCount',
            header: 'Students',
            render: (value, row) => row._count?.students || 0
        }
    ];

    const handleEdit = (dept) => {
        setEditingId(dept.id);
        setFormData({
            name: dept.name,
            code: dept.code,
            hod: dept.headOfDepartment || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (dept) => {
        if (window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
            try {
                await departmentApi.delete(dept.id);
                fetchDepartments();
            } catch (error) {
                console.error("Failed to delete department", error);
                alert("Failed to delete department");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                code: formData.code,
                headOfDepartment: formData.hod
            };

            if (editingId) {
                await departmentApi.update(editingId, payload);
            } else {
                await departmentApi.create(payload);
            }

            setIsModalOpen(false);
            setFormData({ name: '', code: '', hod: '' });
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            console.error("Failed to save department", error);
            alert("Failed to save department");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', code: '', hod: '' });
        setEditingId(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
                    <p className="text-gray-600">Manage academic departments</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Department
                </Button>
            </div>

            <TableView
                columns={columns}
                data={departments}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Edit Department" : "Add New Department"}
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
                </form>
            </Modal>
        </div>
    );
};

export default DepartmentPage;
