import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = ({ role }) => {
  console.log("✅ MainLayout.jsx Loaded with Role:", role);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar (Fixed Left) */}
      <div style={{ width: "250px", position: "fixed", height: "100vh", background: "#343a40" }}>
        <Sidebar role={role} />
      </div>

      {/* Main Content (Pushed to the right of sidebar) */}
      <div style={{ marginLeft: "250px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header (Fixed Top) */}
        <div style={{ position: "fixed", top: 0, left: "250px", width: "calc(100% - 250px)", zIndex: 1000, background: "#f8f9fa", padding: "1rem", borderBottom: "2px solid #dee2e6" }}>
          <Header userName="Admin" userRole={role} />
        </div>

        {/* Dashboard Content (Scrollable) */}
        <div style={{ marginTop: "60px", flexGrow: 1, overflowY: "auto", padding: "1rem", height: "calc(100vh - 60px)" }}>
          <Outlet /> {/* This is where AdminDashboard, MentorDashboard, or StudentDashboard will be loaded */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
