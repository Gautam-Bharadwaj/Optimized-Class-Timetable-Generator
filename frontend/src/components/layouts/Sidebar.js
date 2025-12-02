import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/types';

const Sidebar = () => {
    const { user } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD, Role.FACULTY, Role.VIEWER] },
        { path: '/dashboard/departments', label: 'Departments', icon: '🏢', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN] },
        { path: '/dashboard/faculty', label: 'Faculty', icon: '👨‍🏫', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD] },
        { path: '/dashboard/classrooms', label: 'Classrooms', icon: '🏫', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN] },
        { path: '/dashboard/subjects', label: 'Subjects', icon: '📚', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD] },
        { path: '/dashboard/timetable', label: 'Timetable', icon: '📅', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD, Role.FACULTY] },
        { path: '/dashboard/approvals', label: 'Approvals', icon: '✅', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD] },
        { path: '/settings', label: 'Settings', icon: '⚙️', roles: [Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD, Role.FACULTY, Role.VIEWER] },
    ];

    const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">Timetable Gen</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    v1.0.0
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
