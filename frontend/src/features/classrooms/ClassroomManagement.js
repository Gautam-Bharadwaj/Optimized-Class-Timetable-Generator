import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const ClassroomManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        type: '',
        department: '',
    });

    const classrooms = [
        { id: 1, name: 'CSE-Lab-1', capacity: 60, type: 'Lab', department: 'CSE', status: 'Available' },
        { id: 2, name: 'Lecture Hall A', capacity: 120, type: 'Lecture', department: 'General', status: 'Available' },
        { id: 3, name: 'ECE-Lab-2', capacity: 50, type: 'Lab', department: 'ECE', status: 'Occupied' },
    ];

    const columns = [
        { key: 'name', header: 'Classroom Name' },
        { key: 'capacity', header: 'Capacity' },
        { key: 'type', header: 'Type' },
        { key: 'department', header: 'Department' },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {value}
                </span>
            ),
        },
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
                    <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
                    <p className="text-gray-600 mt-1">Manage classrooms and laboratories</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Classroom
                </Button>
            </div>

            <Card>
                <Table columns={columns} data={classrooms} />
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
                        <Button onClick={handleSubmit}>Save Classroom</Button>
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

export default ClassroomManagement;
