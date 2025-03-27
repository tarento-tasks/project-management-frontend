import React from "react";
import GeneralLayout from "../layouts/GeneralLayout";
import CardComponent from "../components/Cards/CardComponent";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  // User data for the first card
  const userData = {
    title: "User Management",
    fields: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
      { key: "role", label: "Role" }
    ],
    data: [
      { id: 1, name: "John Doe", email: "john@example.com", status: "Approved", role: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", role: "Mentor" },
      { id: 3, name: "Alice Johnson", email: "alice@example.com", status: "Rejected", role: "Student" }
    ]
  };

  // Project data for the second card
  const projectData = {
    title: "Project Status",
    fields: [
      { key: "projectId", label: "Project ID" },
      { key: "projectName", label: "Project Name" },
      { key: "status", label: "Status" },
      { key: "progress", label: "Progress" }
    ],
    data: [
      { projectId: "P-001", projectName: "Website Redesign", status: "In Progress", progress: "65%" },
      { projectId: "P-002", projectName: "Mobile App", status: "Pending", progress: "15%" },
      { projectId: "P-003", projectName: "API Integration", status: "Completed", progress: "100%" }
    ]
  };

  // Task data for the third card
  const taskData = {
    title: "Recent Tasks",
    fields: [
      { key: "taskId", label: "Task ID" },
      { key: "description", label: "Description" },
      { key: "assignedTo", label: "Assigned To" },
      { key: "status", label: "Status" }
    ],
    data: [
      { taskId: "T-101", description: "Design homepage", assignedTo: "John Doe", status: "Completed" },
      { taskId: "T-102", description: "Implement auth", assignedTo: "Jane Smith", status: "In Progress" },
      { taskId: "T-103", description: "Write documentation", assignedTo: "Alice Johnson", status: "Pending" }
    ]
  };

  return (
    <GeneralLayout role="admin">
      <div className={styles.dashboardContent}>
        <h2>Admin Dashboard</h2>
        
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <CardComponent {...userData} />
          </div>
          <div className="col-md-6 mb-3">
            <CardComponent {...projectData} />
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <CardComponent {...taskData} />
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
};

export default Dashboard;