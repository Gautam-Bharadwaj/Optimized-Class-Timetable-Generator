import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { classroomApi } from './classroom.api';
import { Loader2, Trash2, Edit2 } from 'lucide-react';

const ClassroomManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        type: '',
        departmentId: '', // Changed to ID
    });
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            const data = await classroomApi.getAll();
            setClassrooms(data);
        } catch (error) {
            console.error("Failed to fetch classrooms", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', header: 'Classroom Name' },
        { key: 'capacity', header: 'Capacity' },
        { key: 'type', header: 'Type' },
        {
            key: 'department',
            header: 'Department',
            render: (value, row) => row.department?.code || '-'
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (value, row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="p-2">
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" className="p-2" onClick={() => handleDelete(row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity)
            };
            await classroomApi.create(payload);
            setIsModalOpen(false);
            setFormData({
                name: '',
                capacity: '',
                type: '',
                departmentId: '',
            });
            fetchClassrooms();
        } catch (error) {
            console.error("Failed to create classroom", error);
            alert("Failed to create classroom");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this classroom?")) {
            try {
                await classroomApi.delete(id);
                fetchClassrooms();
            } catch (error) {
                console.error("Failed to delete classroom", error);
                alert("Failed to delete classroom");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Classroom Management</h1>
                    <p className="text-slate-600 mt-1">Manage classrooms and laboratories</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <span>+ Add Classroom</span>
                </Button>
            </div>

            <Card>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <Table columns={columns} data={classrooms} />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Classroom"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Classroom'}
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
                        label="Capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="e.g., 60"
                        required
                    />
                    <Input
                        label="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="e.g., Lab, Lecture, Tutorial"
                        required
                    />
                    <Input
                        label="Department ID"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        placeholder="e.g., 1"
                        required
                    />
                </form>
            </Modal>
        </div>
    );
};

export default ClassroomManagement;
