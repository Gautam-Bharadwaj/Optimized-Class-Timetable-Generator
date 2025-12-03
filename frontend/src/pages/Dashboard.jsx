import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentApi } from '../api/department.api';
import { facultyApi } from '../api/faculty.api';
import { classroomApi } from '../api/classroom.api';
import { subjectApi } from '../api/subject.api';
import Loader from '../components/Loader';

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
        { label: 'Generate Timetable', path: '/dashboard/timetable/generate', icon: '📅', color: 'bg-blue-600' },
        { label: 'Add Faculty', path: '/dashboard/faculty', icon: '➕', color: 'bg-green-600' },
        { label: 'Manage Subjects', path: '/dashboard/subjects', icon: '📝', color: 'bg-purple-600' },
    ];

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your timetable system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} text-white rounded-lg flex items-center justify-center text-2xl shadow-sm`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.label} to={action.path}>
                            <div className={`${action.color} text-white p-6 rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 cursor-pointer shadow-sm`}>
                                <div className="text-3xl mb-2">{action.icon}</div>
                                <h3 className="text-lg font-semibold">{action.label}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
