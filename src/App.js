import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from "./layouts/DashboardLayout"; // Corrected import path
import Dashboard from "./pages/Dashboard"; // Corrected import path

const AppRoutes = ({ role }) => {
  return (
    <Routes>
      {/* Route for Dashboard page */}
      <Route path="/dashboard" element={<DashboardLayout><Dashboard role={role} /></DashboardLayout>} />
    </Routes>
  );
};

export default AppRoutes;
