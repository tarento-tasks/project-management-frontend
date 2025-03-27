import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../states/authState';
import LoginPage from '../pages/LoginPage/LoginPage';
import Dashboard from '../pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useRecoilValue(authState);
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Protected Role-Specific Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard role="admin" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <Dashboard role="mentor" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard role="student" />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback Routes */}
      <Route path="/unauthorized" element={<div>You don't have permission to access this page</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;