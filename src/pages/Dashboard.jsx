import React from "react";
import { useParams } from "react-router-dom";
import GeneralLayout from "../layouts/GeneralLayout";
import CardComponent from "../components/Cards/CardComponent";
import ProgressCard from "../components/ProgressCard/ProgressCard";
import PieChartComponent from "../components/PieChart/PieChartComponent";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const { role } = useParams();
  
  // Validate role and redirect if invalid
  if (!['admin', 'mentor', 'student'].includes(role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Progress Card Data (from your storybook)
  const progressData = {
    admin: {
      title: "Project Overview",
      data: [
        { title: "Active Projects", value: 5 },
        { title: "Total Tasks", value: 20 },
        { title: "Completed Tasks", value: 12 }
      ]
    },
    mentor: {
      title: "My Projects Overview",
      data: [
        { title: "Active Projects", value: 3 },
        { title: "Total Tasks", value: 15 },
        { title: "Completed Tasks", value: 10 }
      ]
    },
    student: {
      title: "My Work Overview",
      data: [
        { title: "Assigned Projects", value: 2 },
        { title: "Total Tasks", value: 10 },
        { title: "Completed Tasks", value: 5 }
      ]
    }
  };

  // Card Component Data
  const cardData = {
    admin: {
      title: "Project Status",
      fields: [
        { key: "projectId", label: "Project ID" },
        { key: "projectName", label: "Project Name" },
        { key: "status", label: "Status" },
        { key: "progress", label: "Progress" }
      ],
      data: [
        { projectId: "P-001", projectName: "Website Redesign", status: "In Progress", progress: "65%" },
        { projectId: "P-002", projectName: "Mobile App", status: "Pending", progress: "15%" }
      ]
    },
    mentor: {
      title: "My Projects",
      fields: [
        { key: "projectId", label: "Project ID" },
        { key: "projectName", label: "Project Name" },
        { key: "progress", label: "Progress" }
      ],
      data: [
        { projectId: "MP-101", projectName: "E-commerce Platform", progress: "75%" },
        { projectId: "MP-102", projectName: "Mobile App", progress: "45%" }
      ]
    },
    student: {
      title: "My Tasks",
      fields: [
        { key: "taskId", label: "Task ID" },
        { key: "taskName", label: "Task Name" },
        { key: "progress", label: "Progress" }
      ],
      data: [
        { taskId: "ST-201", taskName: "Design UI Mockups", progress: "100%" },
        { taskId: "ST-202", taskName: "Implement Authentication", progress: "60%" }
      ]
    }
  };

  // Pie Chart Data
  const pieChartData = {
    admin: {
      title: "Project Status Distribution",
      labels: ["Completed", "In Progress", "Pending", "On Hold"],
      values: [15, 8, 5, 2],
      colors: ["#4BC0C0", "#36A2EB", "#FFCE56", "#FF6384"]
    },
    mentor: {
      title: "Projects Completion",
      labels: ["Completed Projects", "Active Projects"],
      values: [8, 7],
      colors: ["#4BC0C0", "#36A2EB"]
    },
    student: {
      title: "Tasks Completion",
      labels: ["Completed Tasks", "Pending Tasks"],
      values: [5, 5],
      colors: ["#4BC0C0", "#FFCE56"]
    }
  };

  return (
    <GeneralLayout role={role}>
      <div className={styles.dashboardContent}>
        <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
        
        {/* Progress Card */}
        <div className="row mb-4">
          <div className="col-12 mb-4">
            <ProgressCard {...progressData[role]} />
          </div>
        </div>
        
        {/* Main Content Row */}
        <div className="row mb-4">
          {/* Card Component (Left) */}
          <div className="col-md-8 mb-3">
            <CardComponent {...cardData[role]} />
          </div>
          
          {/* Pie Chart (Right) */}
          <div className="col-md-4 mb-3">
            <PieChartComponent {...pieChartData[role]} />
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
};

export default Dashboard;