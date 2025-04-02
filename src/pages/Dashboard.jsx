// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import GeneralLayout from "../layouts/GeneralLayout";
import CardComponent from '../components/Cards/CardComponent';
import ProgressCard from '../components/ProgressCard/ProgressCard';
import PieChartComponent from '../components/PieChart/PieChartComponent';
import { authState } from '../states/authState';
import styles from './dashboard.module.css';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    progressData: null,
    cardData: null,
    pieChartData: null
  });

  const processDashboardData = (role, rawData) => {
    const { projects = [], tasks = [], enrollments = [], studentTasks = [] } = rawData;

    // Common calculations
    const completedTasks = tasks.filter(t => t.complete_status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.complete_status === 'Pending').length;
    const activeProjects = projects.filter(p => p.open_status === 'true').length;

    // Helper function to calculate project progress
    const calculateProjectProgress = (projectId) => {
      const projectTasks = tasks.filter(t => t.projectId === projectId);
      if (projectTasks.length === 0) return '0%';
      const completed = projectTasks.filter(t => t.complete_status === 'Completed').length;
      return `${Math.round((completed / projectTasks.length) * 100)}%`;
    };

    switch (role) {
      case 'ADMIN':
        return {
          progressData: {
            title: "Project Overview",
            data: [
              { title: "Projects", value: projects.length },
              { title: "Total Tasks", value: tasks.length },
              { title: "Completed Tasks", value: completedTasks }
            ]
          },
          cardData: {
            title: "Project Status",
            fields: [
              { key: "projectId", label: "Project ID" },
              { key: "projectName", label: "Project Name" },
              { key: "status", label: "Status" },
              { key: "progress", label: "Progress" }
            ],
            data: projects.slice(0, 5).map(project => ({
              projectId: project.projectId.substring(0, 6).toUpperCase(),
              projectName: project.title || 'Unnamed Project',
              status: project.openStatus ? 'Open' : 'Closed',
              progress: calculateProjectProgress(project.projectId)
            }))
            
          },
          pieChartData: {
            title: "Project Status Distribution",
            labels: ["Completed", "Pending", "In Progress"],
            values: [
              completedTasks,
              pendingTasks,
              tasks.length - completedTasks - pendingTasks
            ],
            colors: ["#4BC0C0", "#3e648b", "#517ea6"]
          }
        };

      case 'MENTOR':
        const mentorProjects = projects.filter(p => p.mentorId === auth.userId);
        const mentorTasks = tasks.filter(t => 
          mentorProjects.some(p => p.projectId === t.projectId)
        );

        return {
          progressData: {
            title: "My Projects Overview",
            data: [
              { title: "Active Projects", value: mentorProjects.length },
              { title: "Total Tasks", value: mentorTasks.length },
              { title: "Completed Tasks", value: mentorTasks.filter(t => t.complete_status === 'Completed').length }
            ]
          },
          cardData: {
            title: "My Projects",
            fields: [
              { key: "projectId", label: "Project ID" },
              { key: "projectName", label: "Project Name" },
              { key: "progress", label: "Progress" }
            ],
            data: mentorProjects.slice(0, 5).map(project => ({
              projectId: project.projectId.substring(0, 6).toUpperCase(),
              projectName: project.title || 'Unnamed Project',
              progress: calculateProjectProgress(project.projectId)
            }))
          },
          pieChartData: (() => {
            // Debugging logs
            console.group('Pie Chart Data Debugging');
            
            // 1. Log all mentor tasks
            console.log('All mentor tasks:', mentorTasks);
            
            // 2. Log status values found in tasks
            const allStatuses = [...new Set(mentorTasks.map(t => t.complete_status))];
            console.log('Unique status values found:', allStatuses);
            
            // 3. Calculate and log counts
            const completedCount = mentorTasks.filter(t => t.complete_status =='completed').length;
            const pendingCount = mentorTasks.filter(t => t.complete_status == 'pending').length;
            
            console.log('Completed tasks count:', completedCount);
            console.log('Pending tasks count:', pendingCount);
            console.log('Total tasks:', mentorTasks.length);
            
            // 4. Verify the final data structure
            const chartData = {
              title: "Projects Completion",
              labels: ["Completed Tasks", "Pending Tasks"],
              values: [
                completedCount || 0,
                pendingCount || 0
              ],
              colors: ["#4BC0C0", "#FFCE56"]
            };
            
            console.log('Final pieChartData structure:', chartData);
            console.groupEnd();
            
            return chartData;
          })()
        };

      case 'STUDENT':
        const approvedProjects = enrollments;
        const assignedTasks = studentTasks;

        return {
          progressData: {
            title: "My Work Overview",
            data: [
              { title: "Assigned Projects", value: approvedProjects.length },
              { title: "Total Tasks", value: assignedTasks.length },
              { title: "Completed Tasks", value: assignedTasks.filter(t => t.complete_status === 'Completed').length }
            ]
          },
          cardData: {
            title: "My Tasks",
            fields: [
              { key: "taskId", label: "Task ID" },
              { key: "taskName", label: "Task Name" },
              { key: "status", label: "Status" },
              { key: "dueDate", label: "Due Date" }
            ],
            data: assignedTasks.slice(0, 5).map(task => ({
              taskId: task.taskId.substring(0, 6).toUpperCase(),
              taskName: task.taskName || 'Unnamed Task',
              status: task.completeStatus || 'Pending',
              dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'
            }))
            
          },
          pieChartData: {
            title: "Tasks Completion",
            labels: ["Completed", "Pending"],
            values: [
              assignedTasks.filter(t => t.complete_status === 'Completed').length,
              assignedTasks.filter(t => t.complete_status !== 'Completed').length
            ],
            colors: ["#4BC0C0", "#FFCE56"]
          }
        };

      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  };

  const fetchData = async () => {
    try {
        console.log("Fetching data...");  // Log before fetching
        setLoading(true);

        // Extract role and userId from the login response
        const { role, userId } = auth;
        const upperRole = role.toUpperCase();

        let rawData = {};

        if (upperRole === 'ADMIN') {
            console.log("Fetching Admin Projects and Tasks...");
            const [projects, tasks] = await Promise.all([
                dashboardService.getProjects(upperRole, userId),
                dashboardService.getTasks()
            ]);
            rawData = { projects, tasks };
            console.log("Admin Data Fetched:", rawData);
        } 
        
        else if (upperRole === 'MENTOR') {
            console.log("Fetching Mentor Projects...");

            // Fetch all projects
            const allProjects = await dashboardService.getProjects(upperRole, userId);
            console.log("All Projects Fetched:", allProjects);
            console.log("Logged-in Mentor ID:", userId);

            // Filter projects where mentorId matches logged-in mentor's userId
            const projects = allProjects.filter(project => project.mentorId === userId);
            console.log("Filtered Mentor Projects:", projects);

            // Extract project IDs assigned to this mentor
            const projectIds = projects.map(project => project.projectId);
            console.log("Mentor's Project IDs:", projectIds);

            let tasks = [];
            if (projectIds.length > 0) {
                console.log("Fetching Mentor Tasks for Assigned Projects...");
                try {
                    // Fetch tasks for each assigned project
                    const taskPromises = projectIds.map(projectId => 
                        dashboardService.getTasksByProjectId(projectId)
                    );

                    // Resolve all task fetch promises
                    const tasksResponses = await Promise.all(taskPromises);

                    // Flatten all fetched tasks into a single array
                    tasks = tasksResponses.flat();
                    console.log("Mentor Tasks Fetched:", tasks);
                } catch (error) {
                    console.error("Error fetching mentor tasks:", error);
                }
            } else {
                console.warn("No project IDs found for this mentor.");
            }

            rawData = { projects, tasks };
        } 
        
        else if (upperRole === 'STUDENT') {
            console.log("Fetching Student Enrollments and Tasks...");
            const [enrollments, studentTasks] = await Promise.all([
                dashboardService.getStudentEnrollments(userId),
                dashboardService.getStudentTasks(userId)
            ]);
            rawData = { enrollments, studentTasks };
            console.log("Student Data Fetched:", rawData);
        }

        console.log("Processing dashboard data...");
        const processedData = processDashboardData(upperRole, rawData);
        console.log("Processed Data:", processedData);

        setDashboardData(processedData);
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
    } finally {
        console.log("Fetching complete.");
        setLoading(false);
    }
};

  

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [auth.isAuthenticated, navigate]);

  if (loading) {
    return (
      <GeneralLayout role={auth.role}>
        <div className={styles.dashboardContent}>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </GeneralLayout>
    );
  }

  if (error) {
    return (
      <GeneralLayout role={auth.role}>
        <div className={styles.dashboardContent}>
          <div className="alert alert-danger">
            <h4>Error Loading Dashboard</h4>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        </div>
      </GeneralLayout>
    );
  }

  return (
    <GeneralLayout role={auth.role}>
      <div className={styles.dashboardContent}>
        <h2 className="mb-4">
          {auth.role.charAt(0) + auth.role.slice(1).toLowerCase()} Dashboard
        </h2>
        
        {/* Progress Card */}
        <div className="row mb-4">
          <div className="col-12 mb-4">
            {dashboardData.progressData && (
              <ProgressCard {...dashboardData.progressData} />
            )}
          </div>
        </div>
        
        {/* Main Content Row */}
        <div className="row mb-4 ">
          {/* Card Component (Left) */}
          <div className="col-md-8 mb-3">
            {dashboardData.cardData && (
              <CardComponent {...dashboardData.cardData} />
            )}
          </div>
          
          {/* Pie Chart (Right) */}
          <div className="col-md-4 mb-3">
            {dashboardData.pieChartData && (
              <PieChartComponent {...dashboardData.pieChartData} />
            )}
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
};

export default Dashboard;