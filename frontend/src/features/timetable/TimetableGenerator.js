import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TimetableGenerator = () => {
    const [constraints, setConstraints] = useState({
        department: '',
        semester: '',
        maxClassesPerDay: '6',
        startTime: '09:00',
        endTime: '17:00',
        breakDuration: '60',
    });

    const [generatedTimetables, setGeneratedTimetables] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setGeneratedTimetables([
                { id: 1, name: 'Option 1', score: 95, conflicts: 0 },
                { id: 2, name: 'Option 2', score: 92, conflicts: 1 },
                { id: 3, name: 'Option 3', score: 88, conflicts: 2 },
            ]);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Timetable Generator</h1>
                <p className="text-gray-600 mt-1">Generate optimized timetables based on constraints</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Constraints Input */}
                <Card title="Input Constraints">
                    <div className="space-y-4">
                        <Input
                            label="Department"
                            value={constraints.department}
                            onChange={(e) => setConstraints({ ...constraints, department: e.target.value })}
                            placeholder="e.g., CSE"
                        />
                        <Input
                            label="Semester"
                            value={constraints.semester}
                            onChange={(e) => setConstraints({ ...constraints, semester: e.target.value })}
                            placeholder="e.g., 3"
                        />
                        <Input
                            label="Max Classes Per Day"
                            type="number"
                            value={constraints.maxClassesPerDay}
                            onChange={(e) => setConstraints({ ...constraints, maxClassesPerDay: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Time"
                                type="time"
                                value={constraints.startTime}
                                onChange={(e) => setConstraints({ ...constraints, startTime: e.target.value })}
                            />
                            <Input
                                label="End Time"
                                type="time"
                                value={constraints.endTime}
                                onChange={(e) => setConstraints({ ...constraints, endTime: e.target.value })}
                            />
                        </div>
                        <Input
                            label="Break Duration (minutes)"
                            type="number"
                            value={constraints.breakDuration}
                            onChange={(e) => setConstraints({ ...constraints, breakDuration: e.target.value })}
                        />
                        <Button
                            onClick={handleGenerate}
                            className="w-full"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : '🚀 Generate Timetable'}
                        </Button>
                    </div>
                </Card>

                {/* Generated Options */}
                <Card title="Generated Timetables">
                    {generatedTimetables.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-4xl mb-4">📅</p>
                            <p>No timetables generated yet</p>
                            <p className="text-sm mt-2">Fill in the constraints and click Generate</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {generatedTimetables.map((timetable) => (
                                <div
                                    key={timetable.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{timetable.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Score: {timetable.score}% | Conflicts: {timetable.conflicts}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary">View</Button>
                                            <Button size="sm" variant="success">Approve</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Timetable Preview */}
            {generatedTimetables.length > 0 && (
                <Card title="Timetable Preview">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2">Time</th>
                                    <th className="border border-gray-300 px-4 py-2">Monday</th>
                                    <th className="border border-gray-300 px-4 py-2">Tuesday</th>
                                    <th className="border border-gray-300 px-4 py-2">Wednesday</th>
                                    <th className="border border-gray-300 px-4 py-2">Thursday</th>
                                    <th className="border border-gray-300 px-4 py-2">Friday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00'].map((time) => (
                                    <tr key={time}>
                                        <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">{time}</td>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                            <td key={day} className="border border-gray-300 px-4 py-2">
                                                {time === '12:00-13:00' ? (
                                                    <div className="text-center text-gray-500 italic">Lunch Break</div>
                                                ) : (
                                                    <div className="text-sm">
                                                        <div className="font-medium">CS101</div>
                                                        <div className="text-gray-600">Dr. Smith</div>
                                                        <div className="text-gray-500">Room: A-101</div>
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TimetableGenerator;
