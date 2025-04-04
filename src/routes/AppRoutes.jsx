import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../states/authState';
import LoginPage from '../pages/LoginPage/LoginPage';
import Dashboard from '../pages/Dashboard';
import NewProject from '../pages/NewProject/NewProject';
import UserManagementPage from '../pages/UserManagement/UserManagementPage';

const ProtectedRoute = ({ children }) => {
  const auth = useRecoilValue(authState);
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // No need for role check here since Dashboard handles it
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Single Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/newprojects" element={ <ProtectedRoute><NewProject />  </ProtectedRoute>} />
      <Route path="/users" element={ <ProtectedRoute><UserManagementPage /> </ProtectedRoute>} />
      
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