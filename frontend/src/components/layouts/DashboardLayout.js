import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
