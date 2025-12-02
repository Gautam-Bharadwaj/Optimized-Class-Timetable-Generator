
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Class Timetable Generator</h1>
            <p className="text-lg text-gray-600 mb-8">Optimize your class schedules effortlessly.</p>
            <div className="space-x-4">
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Login</Link>
                <Link to="/signup" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Sign Up</Link>
            </div>
        </div>
    );
};

export default Home;
