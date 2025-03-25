import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout"; // Corrected import
import Dashboard from "../pages/Dashboard";  // The single dashboard component for all users
import NotFound from "../pages/NotFound";

const AppRoutes = ({ role, userName }) => {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout role={role} />}>
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="mentor/dashboard" element={<MentorDashboard />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
  </BrowserRouter>
  );
};

export default AppRoutes;
