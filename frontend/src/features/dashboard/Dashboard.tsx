import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const stats = [
        { label: 'Total Departments', value: '8', icon: '🏢', color: 'bg-blue-500' },
        { label: 'Faculty Members', value: '45', icon: '👨‍🏫', color: 'bg-green-500' },
        { label: 'Classrooms', value: '32', icon: '🏫', color: 'bg-purple-500' },
        { label: 'Subjects', value: '120', icon: '📚', color: 'bg-orange-500' },
    ];

    const quickActions = [
        { label: 'Generate Timetable', path: '/dashboard/timetable', icon: '📅', color: 'bg-blue-600' },
        { label: 'Add Faculty', path: '/dashboard/faculty', icon: '➕', color: 'bg-green-600' },
        { label: 'Manage Subjects', path: '/dashboard/subjects', icon: '📝', color: 'bg-purple-600' },
    ];

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
