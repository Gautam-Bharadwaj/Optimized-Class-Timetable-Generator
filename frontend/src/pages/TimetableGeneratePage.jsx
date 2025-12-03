import { useState, useEffect } from 'react';
import { departmentApi } from '../api/department.api';
import { timetableApi } from '../api/timetable.api';
import Loader from '../components/Loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Loader2, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

const TimetableGeneratePage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [generatedTimetable, setGeneratedTimetable] = useState(null);
    const [formData, setFormData] = useState({
        departmentId: '',
        semester: '',
        objective: 'balance' // 'balance' or 'utilization'
    });

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const data = await departmentApi.getAll();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepts();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        setGeneratedTimetable(null);

        try {
            // Call the generation API
            const result = await timetableApi.generate({
                departmentId: parseInt(formData.departmentId),
                semester: parseInt(formData.semester),
                objective: formData.objective
            });
            setGeneratedTimetable(result);
        } catch (error) {
            console.error("Failed to generate timetable", error);
            const message = error.response?.data?.message || error.message || "Failed to generate timetable";
            alert(`Error: ${message}`);
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedTimetable) return;
        try {
            // Assuming the result contains the timetable structure to save
            // This might need adjustment based on your exact API response structure
            await timetableApi.create(generatedTimetable);
            alert("Timetable saved successfully!");
            setGeneratedTimetable(null);
        } catch (error) {
            console.error("Failed to save timetable", error);
            alert("Failed to save timetable");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Generate Timetable</h1>
                <p className="text-gray-600">AI-powered timetable generation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-1">
                    <Card title="Configuration">
                        <form onSubmit={handleGenerate} className="space-y-4">
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    placeholder="e.g., 3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={formData.objective}
                                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                >
                                    <option value="balance">Balance Workload</option>
                                    <option value="utilization">Maximize Resource Utilization</option>
                                </select>
                            </div>

                            <Button type="submit" disabled={generating} className="w-full flex justify-center items-center gap-2">
                                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                                {generating ? 'Generating...' : 'Generate Timetable'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2">
                    <Card title="Generated Timetable">
                        {!generatedTimetable && !generating && (
                            <div className="text-center py-12 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Configure settings and click Generate to create a timetable.</p>
                            </div>
                        )}

                        {generating && (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin" />
                                <p className="text-gray-600">AI is optimizing the schedule...</p>
                                <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
                            </div>
                        )}

                        {generatedTimetable && (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-green-900">Timetable Generated Successfully</h3>
                                        <p className="text-sm text-green-700 mt-1">
                                            The algorithm has found an optimal schedule based on your constraints.
                                        </p>
                                    </div>
                                </div>

                                {/* Placeholder for Grid View - In a real app, you'd map over generatedTimetable.slots */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b text-sm font-medium text-gray-700">
                                        Preview (First 5 slots)
                                    </div>
                                    <div className="divide-y">
                                        {/* Mock preview if actual structure is complex, or map real data */}
                                        {generatedTimetable.length > 0 ? (
                                            generatedTimetable.slice(0, 5).map((slot, idx) => (
                                                <div key={idx} className="px-4 py-3 text-sm flex justify-between">
                                                    <span className="font-medium">{slot.day} - {slot.time}</span>
                                                    <span className="text-gray-600">{slot.subject} ({slot.type})</span>
                                                    <span className="text-gray-500">{slot.room}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-sm text-gray-500">No slots data available to preview.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <Button variant="secondary" onClick={() => setGeneratedTimetable(null)}>
                                        Discard
                                    </Button>
                                    <Button onClick={handleSave}>
                                        Save Timetable
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TimetableGeneratePage;
