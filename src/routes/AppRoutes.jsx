import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout"; // Common DashboardLayout
import Dashboard from "../pages/Dashboard"; // Common Dashboard page
import NotFound from "../pages/NotFound"; // Not Found page

const AppRoutes = ({ role, userName }) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main route for dashboard */}
        <Route path="/" element={<DashboardLayout userName={userName} userRole={role} />}>
          <Route path="dashboard" element={<Dashboard role={role} userName={userName} />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
