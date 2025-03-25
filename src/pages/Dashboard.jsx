import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProgressCard from "../components/ProgressCard/ProgressCard";  // Correct path
import PieChartComponent from "../components/PieChart/PieChartComponent";  // Correct path
import CalendarComponent from "../components/Calendar/Calendar";   // Reusable Calendar Component
import "./dashboard.module.css";

const Dashboard = ({ role, userName }) => {
  const [userData, setUserData] = useState(null);

  // Example data (you will replace this with actual API calls)
  const adminData = {
    totalProjects: 10,
    totalTasks: 50,
    completedTasks: 45,
  };

  const mentorData = {
    assignedProjects: 5,
    totalTasks: 25,
    completedTasks: 20,
  };

  const studentData = {
    assignedProjects: 3,
    totalTasks: 15,
    completedTasks: 10,
  };

  useEffect(() => {
    // Fetch data based on the role
    switch (role) {
      case "admin":
        setUserData(adminData);
        break;
      case "mentor":
        setUserData(mentorData);
        break;
      case "student":
        setUserData(studentData);
        break;
      default:
        setUserData(null);
    }
  }, [role]);

  // If data is not loaded, show loading state
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout userName={userName} userRole={role}>
      <div className="dashboardContent">
        <h3 className="text-center">Welcome to Your Dashboard, {userName}!</h3>

        {/* Display role-specific data */}
        <div className="row">
          {/* Progress Cards */}
          <div className="col-md-4">
            <ProgressCard
              title="Projects Overview"
              data={[
                {
                  title: "Total Projects",
                  value: userData.totalProjects || userData.assignedProjects,
                },
                {
                  title: "Total Tasks",
                  value: userData.totalTasks,
                },
                {
                  title: "Completed Tasks",
                  value: userData.completedTasks,
                },
              ]}
            />
          </div>

          {/* Pie Chart for progress */}
          <div className="col-md-4">
            <PieChartComponent
              title="Project Progress"
              labels={["Completed", "Remaining"]}
              values={[userData.completedTasks, userData.totalTasks - userData.completedTasks]}
              colors={["#4CAF50", "#FF6347"]}
            />
          </div>

          {/* Calendar for project deadlines */}
          <div className="col-md-4">
            <CalendarComponent projectDeadline="2025-05-10" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
