import { useState, useEffect } from 'react';
import { subjectApi } from '../features/subjects/subject.api';
import { departmentApi } from '../features/departments/department.api';
import TableView from '../components/TableView';
import Loader from '../components/Loader';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

const SubjectPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        credits: '',
        type: '',
        lecturesPerWeek: '',
        semester: '',
        departmentId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectData, deptData] = await Promise.all([
                    subjectApi.getAll(),
                    departmentApi.getAll()
                ]);
                setSubjects(subjectData);
                setDepartments(deptData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchSubjects = async () => {
        try {
            const data = await subjectApi.getAll();
            setSubjects(data);
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        }
    };

    const columns = [
        { key: 'code', header: 'Code' },
        { key: 'name', header: 'Subject Name' },
        { key: 'credits', header: 'Credits' },
        { key: 'type', header: 'Type' },
        { key: 'semester', header: 'Sem' },
        { key: 'lecturesPerWeek', header: 'L/W' },
        {
            key: 'department',
            header: 'Department',
            render: (value, row) => row.department?.code || '-'
        }
    ];

    const handleEdit = (row) => {
        setEditingId(row.id);
        setFormData({
            code: row.code,
            name: row.name,
            credits: row.credits,
            type: row.type,
            lecturesPerWeek: row.lecturesPerWeek,
            semester: row.semester,
            departmentId: row.departmentId,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            try {
                await subjectApi.delete(row.id);
                fetchSubjects();
            } catch (error) {
                console.error("Failed to delete subject", error);
                alert("Failed to delete subject");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                credits: parseInt(formData.credits),
                lecturesPerWeek: parseInt(formData.lecturesPerWeek),
                semester: parseInt(formData.semester),
                departmentId: parseInt(formData.departmentId)
            };

            if (editingId) {
                await subjectApi.update(editingId, payload);
            } else {
                await subjectApi.create(payload);
            }

            handleCloseModal();
            fetchSubjects();
        } catch (error) {
            console.error("Failed to save subject", error);
            alert("Failed to save subject");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            code: '',
            name: '',
            credits: '',
            type: '',
            lecturesPerWeek: '',
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
                    <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
                    <p className="text-gray-600">Manage course catalog</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Subject
                </Button>
            </div>

            <TableView
                columns={columns}
                data={subjects}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Edit Subject" : "Add New Subject"}
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
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            placeholder="e.g., Lecture"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Lectures/Week"
                            type="number"
                            value={formData.lecturesPerWeek}
                            onChange={(e) => setFormData({ ...formData, lecturesPerWeek: e.target.value })}
                            placeholder="e.g., 3"
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

export default SubjectPage;
