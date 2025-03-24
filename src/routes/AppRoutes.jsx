import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/AdminDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import NotFound from "../pages/NotFound";

const AppRoutes = ({ role }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout role={role} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="mentor/dashboard" element={<MentorDashboard />} />
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;

