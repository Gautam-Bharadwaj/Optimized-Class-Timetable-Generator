import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const SubjectManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        credits: '',
        type: '',
        lecturesPerWeek: '',
        department: '',
    });

    const subjects = [
        {
            id: 1,
            code: 'CS101',
            name: 'Data Structures',
            credits: 4,
            type: 'Lecture',
            lecturesPerWeek: 3,
            department: 'CSE',
        },
        {
            id: 2,
            code: 'CS102',
            name: 'Database Lab',
            credits: 2,
            type: 'Lab',
            lecturesPerWeek: 2,
            department: 'CSE',
        },
    ];

    const columns = [
        { key: 'code', header: 'Code' },
        { key: 'name', header: 'Subject Name' },
        { key: 'credits', header: 'Credits' },
        { key: 'type', header: 'Type' },
        { key: 'lecturesPerWeek', header: 'Lectures/Week' },
        { key: 'department', header: 'Department' },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Edit</Button>
                    <Button size="sm" variant="danger">Delete</Button>
                </div>
            ),
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
                    <p className="text-gray-600 mt-1">Manage subjects and course catalog</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Subject
                </Button>
            </div>

            <Card>
                <Table columns={columns} data={subjects} />
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
                        <Button onClick={handleSubmit}>Save Subject</Button>
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
                        label="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., CSE"
                        required
                    />
                </form>
            </Modal>
        </div>
    );
};

export default SubjectManagement;
