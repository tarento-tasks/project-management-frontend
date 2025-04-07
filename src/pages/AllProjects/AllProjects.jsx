import React, { useEffect, useState } from "react";
import GeneralLayout from "../../layouts/GeneralLayout";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import styles from "./allProjects.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

import axios from "axios";
import dayjs from "dayjs";

const API_URL = "http://localhost:8080/api/projects";
const TASKS_API = "http://localhost:8080/api/tasks";
const STUDENT_PROJECTS_API = "http://localhost:8080/api/project-enrollment";

const AllProjects = () => {
  const [projects, setProjects] = useState({
    todo: [],
    inProgress: [],
    completed: [],
    overdue: [],
  });

  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");
      setRole(userRole);

      try {
        const projectResponse = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let studentApprovedProjectIds = [];
        if (userRole === "STUDENT") {
          const approvedRes = await axios.get(STUDENT_PROJECTS_API, {
            headers: { Authorization: `Bearer ${token}` },
          });
          studentApprovedProjectIds = approvedRes.data.response.map(
            (proj) => proj.projectId
          );
        }

        if (
          projectResponse.data.response &&
          Array.isArray(projectResponse.data.response)
        ) {
          const fetchedProjects = projectResponse.data.response;
          const categorized = {
            todo: [],
            inProgress: [],
            completed: [],
            overdue: [],
          };

          for (const project of fetchedProjects) {
            const isMentor =
              userRole === "MENTOR" && project.mentorId === userId;
            const isStudent =
              userRole === "STUDENT" &&
              studentApprovedProjectIds.includes(project.projectId);
            const isAdmin = userRole === "ADMIN";

            if (!isMentor && !isStudent && !isAdmin) {
              continue;
            }

            let tasks = [];
            try {
              const tasksResponse = await axios.get(
                `${TASKS_API}?projectId=${project.projectId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              tasks = tasksResponse.data.response || [];
            } catch (taskErr) {
              const isExpected =
                taskErr.response?.status === 500 &&
                taskErr.response?.data?.message?.includes(
                  "not authorized to view tasks"
                );
              if (!isExpected) {
                console.error(
                  `Error fetching tasks for project ${project.title}:`,
                  taskErr
                );
              }
            }

            const today = dayjs();
            const lastDate = dayjs(project.lastDate);
            const dueDate = dayjs(project.dueDate);
            const allCompleted =
              tasks.length > 0 && tasks.every((t) => t.completeStatus);

            let status = "todo";
            if (allCompleted) {
              status = "completed";
            } else if (today.isAfter(dueDate)) {
              status = "overdue";
            } else if (today.isAfter(lastDate)) {
              status = "inProgress";
            }

            const formattedProject = {
              title: project.title || "Untitled Project",
              description: project.description || "No description available",
              lastDate: project.lastDate || "N/A",
              dueDate: project.dueDate || "N/A",
              repo: project.repo || "No repository",
              projectId: project.projectId,
            };

            categorized[status.toLowerCase()].push(formattedProject);
          }

          setProjects(categorized);
        } else {
          console.error("Unexpected API response format:", projectResponse.data);
        }
      } catch (error) {
        console.error("Error fetching projects or tasks:", error);
      }
    };

    fetchProjects();
  }, []);

  const filterBySearch = (list) =>
    list.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <GeneralLayout>
  <div className={styles.allprojectscontainer}>
    {/* Title + Search in one row */}
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
      {/* To Do Column */}
      <div className={styles.columnWrapper}>
        <div className={`${styles.columnHeader} ${styles.toBeReviewedHeader}`}>
          <h3>To Do</h3>
        </div>
        <div className={`${styles.column} ${styles.toBeReviewed}`}>
          {filterBySearch(projects.todo).map((project, index) => (
            <Link
            key={index}
            to={`/projects/${project.projectId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProjectCard {...project} />
          </Link>
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div className={styles.columnWrapper}>
        <div className={`${styles.columnHeader} ${styles.inProgressHeader}`}>
          <h3>In Progress</h3>
        </div>
        <div className={`${styles.column} ${styles.inProgress}`}>
          {filterBySearch(projects.inProgress).map((project, index) => (
            <Link
            key={index}
            to={`/projects/${project.projectId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProjectCard {...project} />
          </Link>
          ))}
        </div>
      </div>

      {/* Completed Column */}
      <div className={styles.columnWrapper}>
        <div className={`${styles.columnHeader} ${styles.completedHeader}`}>
          <h3>Completed</h3>
        </div>
        <div className={`${styles.column} ${styles.completed}`}>
          {filterBySearch(projects.completed).map((project, index) => (
            <Link
            key={index}
            to={`/projects/${project.projectId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProjectCard {...project} />
          </Link>
          ))}
        </div>
      </div>

      {/* Overdue Column */}
      <div className={styles.columnWrapper}>
        <div className={`${styles.columnHeader} ${styles.overdueHeader}`}>
          <h3>Overdue</h3>
        </div>
        <div className={`${styles.column} ${styles.overdue}`}>
          {filterBySearch(projects.overdue).map((project, index) => (
            <Link
            key={index}
            to={`/projects/${project.projectId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProjectCard {...project} />
          </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</GeneralLayout>

  );
};

export default AllProjects;
