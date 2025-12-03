import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { timetableApi } from './timetable.api';
import { useAuth } from '../../hooks/useAuth';
import { TimetableStatus } from '../../types/types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';

const TimetableApprovalList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTimetables();
    }, [user]);

    const loadTimetables = async () => {
        try {
            setLoading(true);
            // In a real app, we would have an endpoint to get all pending timetables
            // For now, we'll fetch by department if user has one, or fetch all
            let data = [];
            if (user?.departmentId) {
                data = await timetableApi.getAll(user.departmentId);
            } else {
                // Mock: fetch for a default department or implement getAll endpoint
                data = await timetableApi.getAll(1);
            }
            // Filter for pending timetables
            setTimetables(data.filter(t => t.status === TimetableStatus.PENDING));
        } catch (error) {
            console.error('Failed to load timetables', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', header: 'Name', accessor: 'name' },
        {
            key: 'createdAt',
            header: 'Created At',
            accessor: 'createdAt',
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'score',
            header: 'Score',
            accessor: 'scoreJson',
            render: (score) => (
                <span className={`font-bold ${score?.overall >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {score?.overall || 'N/A'}%
                </span>
            )
        },
        {
            key: 'conflicts',
            header: 'Conflicts',
            accessor: 'scoreJson',
            render: (score) => (
                <span className={`font-bold ${score?.conflicts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {score?.conflicts || 0}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            accessor: 'id',
            render: (id) => (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/dashboard/approvals/${id}`)}
                >
                    Review
                </Button>
            )
        }
    ];

    if (loading) {
        return <div className="p-6 text-center">Loading pending approvals...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Pending Approvals</h1>
                <Button variant="secondary" onClick={loadTimetables}>
                    Refresh
                </Button>
            </div>

            <Card>
                {timetables.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No pending timetables found.
                    </div>
                ) : (
                    <Table
                        data={timetables}
                        columns={columns}
                    />
                )}
            </Card>
        </div>
    );
};

export default TimetableApprovalList;
