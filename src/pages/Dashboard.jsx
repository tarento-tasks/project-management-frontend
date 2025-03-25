import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProgressCard from "../components/ProgressCard/ProgressCard";
import CardComponent from "../components/Cards/CardComponent";
import PieChartComponent from "../components/PieChart/PieChartComponent";
import CalendarComponent from "../components/Calendar/Calendar";
import "./dashboard.module.css";

const Dashboard = ({ role, userName }) => {
  const [userData, setUserData] = useState(null);

  // Hardcoded data for each role
  const adminData = {
    totalProjects: 10,
    totalTasks: 50,
    completedTasks: 45,
    projectDetails: [
      { projectName: "Project 1", status: "approved" },
      { projectName: "Project 2", status: "pending" },
    ],
    taskDetails: [ // Add taskDetails for Admin
      { taskName: "Admin Task 1", status: "approved" },
      { taskName: "Admin Task 2", status: "pending" },
    ]
  };
  const mentorData = {
    assignedProjects: 5,
    totalTasks: 25,
    completedTasks: 20,
    taskDetails: [
      { taskName: "Task 1", status: "approved" },
      { taskName: "Task 2", status: "rejected" },
    ],
  };

  const studentData = {
    assignedProjects: 3,
    totalTasks: 15,
    completedTasks: 10,
    taskDetails: [
      { taskName: "Task A", status: "approved" },
      { taskName: "Task B", status: "pending" },
    ],
  };

  useEffect(() => {
    // Assign data based on the role directly (no API call needed)
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
  }, [role]); // Trigger this effect when role changes

  // If data is not loaded, show loading state
  if (!userData) {
    return <div>Loading...</div>;
  }

  // Fields for CardComponent
  const fields = [
    { key: "taskName", label: "Task Name" },
    { key: "status", label: "Status" },
  ];

  return (
    <DashboardLayout userName={userName} userRole={role}>
      <div className="dashboardContent">
        <h3 className="text-center">Welcome to Your Dashboard, {userName}!</h3>

        {/* Display role-specific data */}
        <div className="row">
          {/* Progress Cards */}
          <div className="col-md-9">
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
          <div className="col-md-3">
            <PieChartComponent
              title="Project Progress"
              labels={["Completed", "Remaining"]}
              values={[userData.completedTasks, userData.totalTasks - userData.completedTasks]}
              colors={["#4CAF50", "#FF6347"]}
            />
          </div>

          {/* Card for Tasks Overview */}
          <div className="col-md-6">
            <CardComponent
              title="Task Details"
              fields={fields}
              data={userData.taskDetails}
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
