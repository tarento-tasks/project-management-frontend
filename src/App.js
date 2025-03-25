import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import OtherPage from '../pages/OtherPage';

const AppRoutes = ({ role }) => {
  return (
    <Routes>
      {/* Example route for Dashboard */}
      <Route path="/dashboard" element={<Dashboard role={role} />} />
      {/* Other routes */}
      <Route path="/other" element={<OtherPage />} />
    </Routes>
  );
};

export default AppRoutes;
