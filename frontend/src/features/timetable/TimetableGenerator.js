import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { timetableApi } from './timetable.api';
import { Loader2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const TimetableGenerator = () => {
    const [constraints, setConstraints] = useState({
        departmentId: '',
        semester: '',
        name: '',
        maxClassesPerDay: '6',
        startTime: '09:00',
        endTime: '17:00',
        breakDuration: '60',
    });

    const [generatedTimetable, setGeneratedTimetable] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        setGeneratedTimetable(null);

        try {
            const result = await timetableApi.generate({
                departmentId: constraints.departmentId,
                semester: parseInt(constraints.semester),
                name: constraints.name || `Timetable ${new Date().toLocaleDateString()}`
            });
            setGeneratedTimetable(result);
        } catch (err) {
            console.error("Generation failed", err);
            setError(err.response?.data?.error || "Failed to generate timetable. Please check constraints and try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Timetable Generator</h1>
                <p className="text-slate-600 mt-1">Generate optimized timetables using AI</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Constraints Input */}
                <div className="lg:col-span-1">
                    <Card title="Configuration">
                        <div className="space-y-4">
                            <Input
                                label="Department ID"
                                value={constraints.departmentId}
                                onChange={(e) => setConstraints({ ...constraints, departmentId: e.target.value })}
                                placeholder="e.g., 1"
                            />
                            <Input
                                label="Semester"
                                value={constraints.semester}
                                onChange={(e) => setConstraints({ ...constraints, semester: e.target.value })}
                                placeholder="e.g., 3"
                            />
                            <Input
                                label="Timetable Name"
                                value={constraints.name}
                                onChange={(e) => setConstraints({ ...constraints, name: e.target.value })}
                                placeholder="Optional name"
                            />

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Advanced Constraints</h4>
                                <Input
                                    label="Max Classes Per Day"
                                    type="number"
                                    value={constraints.maxClassesPerDay}
                                    onChange={(e) => setConstraints({ ...constraints, maxClassesPerDay: e.target.value })}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                onClick={handleGenerate}
                                className="w-full mt-4"
                                disabled={isGenerating || !constraints.departmentId || !constraints.semester}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Generate Timetable
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-2">
                    {!generatedTimetable ? (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">Ready to Generate</h3>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Enter the department and semester details to generate an optimized timetable.
                            </p>
                        </Card>
                    ) : (
                        <Card title={generatedTimetable.name || "Generated Timetable"}>
                            <div className="mb-6 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg w-fit">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Timetable Generated Successfully</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Day</th>
                                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Time</th>
                                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Subject</th>
                                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Faculty</th>
                                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Room</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generatedTimetable.slots?.sort((a, b) => {
                                            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                            if (days.indexOf(a.dayOfWeek) !== days.indexOf(b.dayOfWeek)) {
                                                return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                                            }
                                            return a.startTime.localeCompare(b.startTime);
                                        }).map((slot, index) => (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="border border-slate-200 px-4 py-3 font-medium text-slate-900">{slot.dayOfWeek}</td>
                                                <td className="border border-slate-200 px-4 py-3 text-slate-600">
                                                    {slot.startTime} - {slot.endTime}
                                                </td>
                                                <td className="border border-slate-200 px-4 py-3 text-slate-900 font-medium">
                                                    {slot.subject?.name || slot.subjectId}
                                                </td>
                                                <td className="border border-slate-200 px-4 py-3 text-slate-600">
                                                    {slot.faculty?.name || slot.facultyId}
                                                </td>
                                                <td className="border border-slate-200 px-4 py-3 text-slate-600">
                                                    {slot.classroom?.name || slot.classroomId}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimetableGenerator;
