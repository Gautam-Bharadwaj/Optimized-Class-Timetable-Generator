import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { departmentApi } from '../departments/department.api';
import { facultyApi } from '../faculty/faculty.api';
import { classroomApi } from '../classrooms/classroom.api';
import { subjectApi } from '../subjects/subject.api';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [statsData, setStatsData] = useState({
        departments: 0,
        faculty: 0,
        classrooms: 0,
        subjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [departments, faculty, classrooms, subjects] = await Promise.all([
                    departmentApi.getAll(),
                    facultyApi.getAll(),
                    classroomApi.getAll(),
                    subjectApi.getAll()
                ]);

                setStatsData({
                    departments: departments.length,
                    faculty: faculty.length,
                    classrooms: classrooms.length,
                    subjects: subjects.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Departments', value: statsData.departments, icon: '🏢', color: 'bg-blue-500' },
        { label: 'Faculty Members', value: statsData.faculty, icon: '👨‍🏫', color: 'bg-green-500' },
        { label: 'Classrooms', value: statsData.classrooms, icon: '🏫', color: 'bg-purple-500' },
        { label: 'Subjects', value: statsData.subjects, icon: '📚', color: 'bg-orange-500' },
    ];

    const quickActions = [
        { label: 'Generate Timetable', path: '/dashboard/timetable', icon: '📅', color: 'bg-blue-600' },
        { label: 'Add Faculty', path: '/dashboard/faculty', icon: '➕', color: 'bg-green-600' },
        { label: 'Manage Subjects', path: '/dashboard/subjects', icon: '📝', color: 'bg-purple-600' },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your timetable system efficiently</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.label} to={action.path}>
                            <div className={`${action.color} text-white p-6 rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}>
                                <div className="text-3xl mb-2">{action.icon}</div>
                                <h3 className="text-lg font-semibold">{action.label}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
                <div className="space-y-3">
                    {[
                        { action: 'Timetable generated for CSE Dept', time: '2 hours ago' },
                        { action: 'New faculty member added', time: '5 hours ago' },
                        { action: 'Classroom C-101 updated', time: '1 day ago' },
                    ].map((activity, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                            <span className="text-gray-700">{activity.action}</span>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
