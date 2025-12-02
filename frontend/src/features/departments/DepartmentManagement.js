import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const DepartmentManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', hod: '' });

    const departments = [
        { id: 1, name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. John Doe', faculty: 12, students: 240 },
        { id: 2, name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. Jane Smith', faculty: 10, students: 200 },
        { id: 3, name: 'Mechanical Engineering', code: 'MECH', hod: 'Dr. Bob Johnson', faculty: 8, students: 160 },
    ];

    const columns = [
        { key: 'code', header: 'Code' },
        { key: 'name', header: 'Department Name' },
        { key: 'hod', header: 'Head of Department' },
        { key: 'faculty', header: 'Faculty Count' },
        { key: 'students', header: 'Students' },
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
        setFormData({ name: '', code: '', hod: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
                    <p className="text-gray-600 mt-1">Manage academic departments</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Add Department
                </Button>
            </div>

            <Card>
                <Table columns={columns} data={departments} />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Department"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Save Department</Button>
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
