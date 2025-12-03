import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { timetableApi } from './timetable.api';
import TimetableViewer from './TimetableViewer';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const TimetableApproval = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectComments, setRejectComments] = useState('');

    useEffect(() => {
        if (id) {
            loadTimetable(parseInt(id));
        }
    }, [id]);

    const loadTimetable = async (timetableId) => {
        try {
            setLoading(true);
            const data = await timetableApi.getById(timetableId);
            setTimetable(data);
        } catch (error) {
            console.error('Failed to load timetable', error);
            navigate('/dashboard/approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!timetable) return;
        try {
            await timetableApi.approve(timetable.id, 'APPROVED', 'Approved by admin');
            navigate('/dashboard/approvals');
        } catch (error) {
            console.error('Failed to approve timetable', error);
        }
    };

    const handleReject = async () => {
        if (!timetable) return;
        try {
            await timetableApi.approve(timetable.id, 'REJECTED', rejectComments);
            setShowRejectModal(false);
            navigate('/dashboard/approvals');
        } catch (error) {
            console.error('Failed to reject timetable', error);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading timetable details...</div>;
    }

    if (!timetable) {
        return <div className="p-6 text-center">Timetable not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Review Timetable</h1>
                <Button variant="secondary" onClick={() => navigate('/dashboard/approvals')}>
                    Back to List
                </Button>
            </div>

            <TimetableViewer
                timetable={timetable}
                onApprove={handleApprove}
                onReject={() => setShowRejectModal(true)}
            />

            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Reject Timetable"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Please provide a reason for rejecting this timetable. This will be visible to the creator.
                    </p>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Enter rejection reason..."
                        value={rejectComments}
                        onChange={(e) => setRejectComments(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleReject} disabled={!rejectComments.trim()}>
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TimetableApproval;
