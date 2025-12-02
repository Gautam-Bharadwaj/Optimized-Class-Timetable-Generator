import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, Menu } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
                        <p className="text-sm text-slate-500 hidden sm:block">Welcome back, {user?.name || 'User'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64">
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 mx-1"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
