import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { facultyApi } from './faculty.api';
import { Loader2, Trash2, Edit2 } from 'lucide-react';

const FacultyManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        departmentId: '', // Changed to ID for relation
        maxWeeklyLoad: '',
        availableDays: '',
    });
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getAll();
            setFaculty(data);
        } catch (error) {
            console.error("Failed to fetch faculty", error);
        } finally {
            setLoading(false);
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
        { key: 'maxWeeklyLoad', header: 'Max Weekly Load (hrs)' },
        {
            key: 'subjects',
            header: 'Subjects Assigned',
            render: (value, row) => row._count?.subjects || 0
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
            // Convert availableDays string to array if needed by backend, or keep as string/JSON
            const payload = {
                ...formData,
                maxWeeklyLoad: parseInt(formData.maxWeeklyLoad),
                availableDays: formData.availableDays.split(',').map(d => d.trim()) // Assuming backend expects array
            };

            await facultyApi.create(payload);
            setIsModalOpen(false);
            setFormData({
                name: '',
                email: '',
                departmentId: '',
                maxWeeklyLoad: '',
                availableDays: '',
            });
            fetchFaculty();
        } catch (error) {
            console.error("Failed to create faculty", error);
            alert("Failed to create faculty");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this faculty member?")) {
            try {
                await facultyApi.delete(id);
                fetchFaculty();
            } catch (error) {
                console.error("Failed to delete faculty", error);
                alert("Failed to delete faculty");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Faculty Management</h1>
                    <p className="text-slate-600 mt-1">Manage faculty members and their workload</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <span>+ Add Faculty</span>
                </Button>
            </div>

            <Card>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <Table columns={columns} data={faculty} />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Faculty Member"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Faculty'}
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
                    <Input
                        label="Department ID" // Ideally this should be a dropdown fetching departments
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        placeholder="e.g., 1"
                        required
                    />
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

export default FacultyManagement;
