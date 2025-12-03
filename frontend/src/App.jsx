import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DepartmentPage from './pages/DepartmentPage';
import AddDepartment from './pages/AddDepartment';
import FacultyPage from './pages/FacultyPage';
import ClassroomPage from './pages/ClassroomPage';
import SubjectPage from './pages/SubjectPage';
import TimetableGeneratePage from './pages/TimetableGeneratePage';
import ApprovalPage from './pages/ApprovalPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/departments" element={<DepartmentPage />} />
                        <Route path="/dashboard/departments/add" element={<AddDepartment />} />
                        <Route path="/dashboard/faculty" element={<FacultyPage />} />
                        <Route path="/dashboard/classrooms" element={<ClassroomPage />} />
                        <Route path="/dashboard/subjects" element={<SubjectPage />} />
                        <Route path="/dashboard/timetable/generate" element={<TimetableGeneratePage />} />
                        <Route path="/dashboard/approvals" element={<ApprovalPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
