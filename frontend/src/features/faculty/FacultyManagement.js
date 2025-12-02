import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const FacultyManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        maxLoad: '',
        availableDays: '',
    });

    const faculty = [
        {
            id: 1,
            name: 'Dr. Alice Brown',
            email: 'alice@college.edu',
            department: 'CSE',
            maxLoad: 18,
            subjects: 3,
            status: 'Active',
        },
        {
            id: 2,
            name: 'Prof. Charlie Davis',
            email: 'charlie@college.edu',
            department: 'ECE',
            maxLoad: 16,
            subjects: 2,
            status: 'Active',
        },
    ];

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'department', header: 'Department' },
        { key: 'maxLoad', header: 'Max Weekly Load (hrs)' },
        { key: 'subjects', header: 'Subjects Assigned' },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
                    <p className="text-gray-600 mt-1">Manage faculty members and their workload</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Faculty
                </Button>
            </div>

            <Card>
                <Table columns={columns} data={faculty} />
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
                        <Button onClick={handleSubmit}>Save Faculty</Button>
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
                        label="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., CSE"
                        required
                    />
                    <Input
                        label="Max Weekly Load (hours)"
                        type="number"
                        value={formData.maxLoad}
                        onChange={(e) => setFormData({ ...formData, maxLoad: e.target.value })}
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
