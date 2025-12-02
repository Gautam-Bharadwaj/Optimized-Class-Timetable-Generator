import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Header = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-sm text-gray-600">Manage your timetable system</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.email || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {user?.email?.[0].toUpperCase() || 'A'}
                        </div>
                    </div>

                    <Button variant="secondary" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
