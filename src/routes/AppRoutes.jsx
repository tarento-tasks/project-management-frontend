import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/AdminDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import NewTask from "../pages/NewTask/NewTask"; // Import NewTask

const AppRoutes = ({ role }) => {
  console.log("✅ AppRoutes.jsx is running");
  console.log("✅ AppRoutes Role:", role);

  return (
    <Routes>
      {/* Redirect "/" to the dashboard of the selected role */}
      <Route path="/" element={<Navigate to={`/${role}/dashboard`} />} />

      {/* MainLayout wraps the role-based dashboard */}
      <Route path={`/${role}`} element={<MainLayout role={role} />}>
        <Route path="dashboard" element={role === "admin" ? <AdminDashboard /> : role === "mentor" ? <MentorDashboard /> : <StudentDashboard />} />
      </Route>

      {/* New Task Page Route */}
      <Route path="/new-task" element={<NewTask />} />

      {/* Catch-all route (redirect unknown routes to dashboard) */}
      <Route path="*" element={<Navigate to={`/${role}/dashboard`} />} />
    </Routes>
  );
};

export default AppRoutes;
