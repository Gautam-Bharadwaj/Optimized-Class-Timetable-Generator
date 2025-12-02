import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Settings from '../pages/Settings';
import Login from '../features/auth/login';
import Signup from '../features/auth/signup';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Dashboard from '../features/dashboard/Dashboard';
import DepartmentManagement from '../features/departments/DepartmentManagement';
import FacultyManagement from '../features/faculty/FacultyManagement';
import ClassroomManagement from '../features/classrooms/ClassroomManagement';
import SubjectManagement from '../features/subjects/SubjectManagement';
import TimetableGenerator from '../features/timetable/TimetableGenerator';
import TimetableApprovalList from '../features/timetable/TimetableApprovalList';
import TimetableApproval from '../features/timetable/TimetableApproval';
import { useAuth } from '../hooks/useAuth';
import RoleGuard from '../components/auth/RoleGuard';
import { Role } from '../types/types';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Dashboard Routes */}
                {/* Protected Dashboard Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD, Role.FACULTY, Role.VIEWER]}>
                                <DashboardLayout>
                                    <Dashboard />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/departments"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN]}>
                                <DashboardLayout>
                                    <DepartmentManagement />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/faculty"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD]}>
                                <DashboardLayout>
                                    <FacultyManagement />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/classrooms"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN]}>
                                <DashboardLayout>
                                    <ClassroomManagement />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/subjects"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD]}>
                                <DashboardLayout>
                                    <SubjectManagement />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/timetable"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD, Role.FACULTY]}>
                                <DashboardLayout>
                                    <TimetableGenerator />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/approvals"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD]}>
                                <DashboardLayout>
                                    <TimetableApprovalList />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/approvals/:id"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD]}>
                                <DashboardLayout>
                                    <TimetableApproval />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[Role.SUPERADMIN, Role.TIMETABLE_ADMIN, Role.HOD, Role.FACULTY, Role.VIEWER]}>
                                <DashboardLayout>
                                    <Settings />
                                </DashboardLayout>
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;