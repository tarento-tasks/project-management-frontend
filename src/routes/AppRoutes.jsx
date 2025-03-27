import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Dashboard with layout */}
      <Route 
        path="/" 
        element={
          
            <Dashboard />
          
        } 
      />
      
      
      
      {/* Add more routes exactly like this */}
      {/* <Route 
        path="/another-route" 
        element={
          <GeneralLayout role="admin">
            <YourComponent />
          </GeneralLayout>
        } 
      /> */}
    </Routes>
  );
};

export default AppRoutes;