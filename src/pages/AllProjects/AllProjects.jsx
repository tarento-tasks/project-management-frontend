import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import styles from "./allProjects.module.css";
import axios from "axios";

const API_URL = "http://localhost:8080/api/projects"; // Change if necessary

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log

        if (response.data.response && Array.isArray(response.data.response)) {
          const formattedProjects = response.data.response.map((project) => ({
            id: project.id || project.projectId, // Ensure ID exists
            title: project.title || "Untitled Project",
            description: project.description || "No description available",
            lastDate: project.lastDate || "N/A",
            dueDate: project.dueDate || "N/A",
            projectStatus: project.projectStatus || "IN_PROGRESS",
            repo: project.repo || "No repository",
          }));
          setProjects(formattedProjects);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  // Group projects based on their status
  const inProgressProjects = projects.filter(
    (p) => p.projectStatus.toUpperCase() === "IN_PROGRESS"
  );
  const toBeReviewedProjects = projects.filter(
    (p) => p.projectStatus.toUpperCase() === "TO_BE_REVIEWED"
  );
  const completedProjects = projects.filter(
    (p) => p.projectStatus.toUpperCase() === "COMPLETED"
  );

  return (
    <DashboardLayout>
      <div className={styles.allprojectscontainer}>
        <h2 className={styles.allprojectstitle}>All Projects</h2>

        <div className={styles.kanbanBoard}>
          {/* In Progress Column */}
          <div className={`${styles.column} ${styles.inProgress}`}>
            <h3> In Progress</h3>
            {inProgressProjects.map((project) => (
              <div
                key={project.id}
                className={styles.projectCard}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ cursor: "pointer" }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>

          {/* To Be Reviewed Column */}
          <div className={`${styles.column} ${styles.toBeReviewed}`}>
            <h3> To Be Reviewed</h3>
            {toBeReviewedProjects.map((project) => (
              <div
                key={project.id}
                className={styles.projectCard}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ cursor: "pointer" }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>

          {/* Completed Column */}
          <div className={`${styles.column} ${styles.completed}`}>
            <h3> Completed</h3>
            {completedProjects.map((project) => (
              <div
                key={project.id}
                className={styles.projectCard}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ cursor: "pointer" }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllProjects;
