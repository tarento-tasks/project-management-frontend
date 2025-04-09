import React, { useEffect, useState } from "react";
import GeneralLayout from "../../layouts/GeneralLayout";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import styles from "./allProjects.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";
import dashboardService from "../../services/dashboardService";
import axios from "axios";
import dayjs from "dayjs";
import { Spinner } from "react-bootstrap";

const API_URL = "http://localhost:8080/api/projects";
const TASKS_API = "http://localhost:8080/api/tasks";

const AllProjects = () => {
  const [projects, setProjects] = useState({
    todo: [],
    inProgress: [],
    completed: [],
    overdue: [],
  });
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userRole || !userId) {
      setError("Authentication information missing");
      setLoading(false);
      return;
    }

    setRole(userRole);
    setLoading(true);
    setError(null);

    try {
      const projectResponse = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let studentApprovedProjectIds = [];
      if (userRole === "STUDENT") {
        try {
          const approvedProjects = await dashboardService.getStudentEnrollments(userId);
          studentApprovedProjectIds = approvedProjects?.map((proj) => proj.projectId) || [];
        } catch (err) {
          console.error("Error getting approved student projects:", err);
        }
      }

      if (!projectResponse?.data?.response || !Array.isArray(projectResponse.data.response)) {
        setError("Invalid projects data format");
        setLoading(false);
        return;
      }

      const fetchedProjects = projectResponse.data.response;
      const categorized = {
        todo: [],
        inProgress: [],
        completed: [],
        overdue: [],
      };

      for (const project of fetchedProjects) {
        try {
          const isMentor = userRole === "MENTOR" && project.mentorId === userId;
          const isStudent = userRole === "STUDENT" && studentApprovedProjectIds.includes(project.projectId);
          const isAdmin = userRole === "ADMIN";

          if (!isMentor && !isStudent && !isAdmin) {
            continue;
          }

          let tasks = [];
          try {
            const tasksResponse = await axios.get(
              `${TASKS_API}?projectId=${project.projectId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            tasks = tasksResponse?.data?.response || [];
          } catch (taskErr) {
            if (!taskErr.response?.status === 500 &&
                !taskErr.response?.data?.message?.includes("not authorized to view tasks")) {
              console.error(`Error fetching tasks for project ${project.title}:`, taskErr);
            }
          }

          const today = dayjs();
          const lastDate = dayjs(project.lastDate || today);
          const dueDate = dayjs(project.dueDate || today);
          const allCompleted = tasks.length > 0 && tasks.every((t) => t.completeStatus);

          let status = "todo";
          if (allCompleted) {
            status = "completed";
          } else if (today.isAfter(dueDate)) {
            status = "overdue";
          } else if (today.isAfter(lastDate)) {
            status = "inProgress";
          }

          const validStatus = ["todo", "inProgress", "completed", "overdue"].includes(status)
            ? status
            : "todo";

          categorized[validStatus].push(project);
        } catch (projectErr) {
          console.error(`Error processing project ${project.projectId}:`, projectErr);
        }
      }

      setProjects(categorized);
    } catch (error) {
      console.error("Error fetching projects or tasks:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filterBySearch = (list) =>
    list.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleProjectUpdate = () => {
    fetchProjects();
  };

  const handleCardClick = (e, project) => {
    if (e.isDefaultPrevented() || showModal) {
      return;
    }
    window.location.href = `/projects/${project.projectId}`;
  };

  if (loading) {
    return (
      <GeneralLayout>
        <div className={styles.loadingContainer}>
          <Spinner animation="border" />
          <p>Loading projects...</p>
        </div>
      </GeneralLayout>
    );
  }

  if (error) {
    return (
      <GeneralLayout>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Error loading projects</h3>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </GeneralLayout>
    );
  }

  return (
    <GeneralLayout>
      <div className={styles.allprojectscontainer}>
        <div className={styles.headerRow}>
          <h2 className={styles.allprojectstitle}>All Projects</h2>
          <div className={styles.searchWrapper}>
            <i className={`bi bi-search ${styles.searchIcon}`}></i>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.kanbanBoard}>
          {["todo", "inProgress", "completed", "overdue"].map((status) => (
            <div key={status} className={styles.columnWrapper}>
              <div className={`${styles.columnHeader} ${styles[`${status}Header`]}`}>
                <h3 className={styles.statusHeading}>
                  {status === "todo" && "To Do"}
                  {status === "inProgress" && "In Progress"}
                  {status === "completed" && "Completed"}
                  {status === "overdue" && "Overdue"}
                </h3>
              </div>
              <div className={`${styles.column} ${styles[status]}`}>
                {filterBySearch(projects[status]).map((project, index) => (
                  <div 
                    key={`${status}-${index}`}
                    className={styles.projectCardWrapper}
                    onClick={(e) => handleCardClick(e, project)}
                  >
                    <ProjectCard
                      project={project}
                      onUpdate={handleProjectUpdate}
                      setParentShowModal={setShowModal}
                    />
                  </div>
                ))}
                {filterBySearch(projects[status]).length === 0 && (
                  <div className={styles.emptyColumn}>
                    No projects in this category
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default AllProjects;