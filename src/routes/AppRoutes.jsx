// routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../states/authState';
import LoginPage from '../pages/LoginPage/LoginPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import StudentProjects from '../pages/StudentProjects/StudentProjects';
import NewProject from '../pages/NewProject/NewProject';
import NewTask from '../pages/NewTask/NewTask';
import Calendar from '../components/Calendar/Calendar';
import UserManagementPage from '../pages/UserManagement/UserManagementPage';
import EnrollmentPage from '../pages/Enrollment/EnrollmentPage';

const ProtectedRoute = ({ children, roles = [] }) => {
  const auth = useRecoilValue(authState);
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Check roles if specified
  if (roles.length > 0 && !roles.includes(auth.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/student/projects" element={ <StudentProjects />} />
      <Route path="/newprojects" element={ <NewProject />} />
      <Route path="/newtask" element={ <NewTask />} />
      <Route path="/users" element={ <UserManagementPage />} />
      <Route path="/enrollments" element={ <EnrollmentPage />} />
      <Route path="/calendar" element={ <Calendar />} />
    
    
      
      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
     
      
      {/* Legacy Role-Specific Routes (Redirect to main dashboard) */}
      <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/mentor/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/student/dashboard" element={<Navigate to="/dashboard" replace />} />
      
      {/* Fallback Routes */}
      <Route path="/unauthorized" element={<div>You don't have permission to access this page</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;