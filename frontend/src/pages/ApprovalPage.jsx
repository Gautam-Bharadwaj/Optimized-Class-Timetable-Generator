import { useState, useEffect } from 'react';
import { timetableApi } from '../api/timetable.api';
import TableView from '../components/TableView';
import Loader from '../components/Loader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const ApprovalPage = () => {
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTimetable, setSelectedTimetable] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        fetchPendingTimetables();
    }, []);

    const fetchPendingTimetables = async () => {
        try {
            setLoading(true);
            // Assuming getAll supports filtering or we filter client-side for now
            const data = await timetableApi.getAll();
            // Filter for PENDING status if API returns all
            const pending = data.filter(t => t.status === 'PENDING' || t.status === 'DRAFT');
            setTimetables(pending);
        } catch (error) {
            console.error("Failed to fetch timetables", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await timetableApi.approve(id, 'APPROVED', 'Approved by HOD');
            fetchPendingTimetables();
        } catch (error) {
            console.error("Failed to approve", error);
            alert("Failed to approve timetable");
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to reject this timetable?")) {
            try {
                await timetableApi.approve(id, 'REJECTED', 'Rejected by HOD');
                fetchPendingTimetables();
            } catch (error) {
                console.error("Failed to reject", error);
                alert("Failed to reject timetable");
            }
        }
    };

    const handleView = (timetable) => {
        setSelectedTimetable(timetable);
        setIsViewModalOpen(true);
    };

    const columns = [
        {
            key: 'department',
            header: 'Department',
            render: (val, row) => row.department?.name || `Dept ${row.departmentId}`
        },
        { key: 'semester', header: 'Semester' },
        {
            key: 'createdAt',
            header: 'Generated On',
            render: (val) => new Date(val).toLocaleDateString()
        },
        {
            key: 'status',
            header: 'Status',
            render: (val) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    val === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {val}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (val, row) => (
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="secondary" onClick={() => handleView(row)} title="View">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(row.id)} title="Approve">
                        <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(row.id)} title="Reject">
                        <XCircle className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Timetable Approvals</h1>
                <p className="text-gray-600">Review and approve generated timetables</p>
            </div>

            <TableView
                columns={columns}
                data={timetables}
                actions={false} // Custom actions in column definition
            />

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Timetable Preview"
                footer={
                    <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                }
            >
                {selectedTimetable ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Department:</span>
                                <span className="ml-2 font-medium">{selectedTimetable.department?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Semester:</span>
                                <span className="ml-2 font-medium">{selectedTimetable.semester}</span>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedTimetable.slots?.map((slot, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{slot.dayOfWeek}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{slot.startTime}-{slot.endTime}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">Sub: {slot.subjectId}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">Fac: {slot.facultyId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p>No data selected</p>
                )}
            </Modal>
        </div>
    );
};

export default ApprovalPage;
