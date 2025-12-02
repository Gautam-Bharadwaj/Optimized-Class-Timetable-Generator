import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { subjectApi } from './subject.api';
import { Loader2, Trash2, Edit2 } from 'lucide-react';

const SubjectManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        credits: '',
        type: '',
        lecturesPerWeek: '',
        departmentId: '', // Changed to ID
    });
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await subjectApi.getAll();
            setSubjects(data);
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'code', header: 'Code' },
        { key: 'name', header: 'Subject Name' },
        { key: 'credits', header: 'Credits' },
        { key: 'type', header: 'Type' },
        { key: 'lecturesPerWeek', header: 'Lectures/Week' },
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
                credits: parseInt(formData.credits),
                lecturesPerWeek: parseInt(formData.lecturesPerWeek)
            };
            await subjectApi.create(payload);
            setIsModalOpen(false);
            setFormData({
                code: '',
                name: '',
                credits: '',
                type: '',
                lecturesPerWeek: '',
                departmentId: '',
            });
            fetchSubjects();
        } catch (error) {
            console.error("Failed to create subject", error);
            alert("Failed to create subject");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await subjectApi.delete(id);
                fetchSubjects();
            } catch (error) {
                console.error("Failed to delete subject", error);
                alert("Failed to delete subject");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Subject Management</h1>
                    <p className="text-slate-600 mt-1">Manage subjects and course catalog</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <span>+ Add Subject</span>
                </Button>
            </div>

            <Card>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <Table columns={columns} data={subjects} />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Subject"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Subject'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Subject Code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., CS101"
                        required
                    />
                    <Input
                        label="Subject Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Data Structures"
                        required
                    />
                    <Input
                        label="Credits"
                        type="number"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        placeholder="e.g., 4"
                        required
                    />
                    <Input
                        label="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="e.g., Lecture, Lab, Tutorial"
                        required
                    />
                    <Input
                        label="Lectures Per Week"
                        type="number"
                        value={formData.lecturesPerWeek}
                        onChange={(e) => setFormData({ ...formData, lecturesPerWeek: e.target.value })}
                        placeholder="e.g., 3"
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

export default SubjectManagement;
