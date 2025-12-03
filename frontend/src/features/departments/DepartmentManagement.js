import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { departmentApi } from './department.api';
import { Loader2, Trash2, Edit2 } from 'lucide-react';

const DepartmentManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', hod: '' });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [editingId, setEditingId] = useState(null);

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
        { key: 'hod', header: 'Head of Department' },
        {
            key: 'facultyCount',
            header: 'Faculty Count',
            render: (value, row) => row._count?.faculties || 0
        },
        {
            key: 'studentCount',
            header: 'Students',
            render: (value, row) => row._count?.students || 0
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (value, row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="p-2" onClick={() => handleEdit(row)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" className="p-2" onClick={() => handleDelete(row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const handleEdit = (department) => {
        setEditingId(department.id);
        setFormData({
            name: department.name,
            code: department.code,
            hod: department.headOfDepartment || '' // Map headOfDepartment to hod
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                code: formData.code,
                headOfDepartment: formData.hod // Map hod to headOfDepartment
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await departmentApi.delete(id);
                fetchDepartments();
            } catch (error) {
                console.error("Failed to delete department", error);
                alert("Failed to delete department");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', code: '', hod: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Department Management</h1>
                    <p className="text-slate-600 mt-1">Manage academic departments</p>
                </div>
                <Button onClick={() => { setEditingId(null); setFormData({ name: '', code: '', hod: '' }); setIsModalOpen(true); }} className="flex items-center gap-2">
                    <span>+ Add Department</span>
                </Button>
            </div>

            <Card>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <Table columns={columns} data={departments} />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Edit Department" : "Add New Department"}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? 'Update Department' : 'Save Department')}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Department Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Computer Science & Engineering"
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
                        placeholder="e.g., Dr. John Doe"
                        required
                    />
                </form>
            </Modal>
        </div>
    );
};

export default DepartmentManagement;
