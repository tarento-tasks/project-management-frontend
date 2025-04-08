import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../layouts/GeneralLayout";
import styles from "./projectDetails.module.css";

const API_URL = "http://localhost:8080/api/projects";
const USERS_API = "http://localhost:8080/api/users";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [mentorName, setMentorName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}?id=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const projectData = response.data.response[0];
      setProject(projectData);

      if (projectData.mentorId) {
        fetchMentorName(projectData.mentorId);
      } else {
        setMentorName("Not Assigned");
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorName = async (mentorId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${USERS_API}?userId=${mentorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.response) {
        setMentorName(response.data.response.name);
      } else {
        setMentorName("Unknown Mentor");
      }
    } catch (err) {
      console.error("Error fetching mentor:", err);
      setMentorName("Unknown Mentor");
    }
  };

  if (loading) return <div className={styles.loading}>Loading project...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!project) return <div className={styles.noData}>No project found.</div>;

  return (
    <DashboardLayout>
      <div className={styles.projectDetails}>
        <h1>{project.title}</h1>
        <p><strong>Objective:</strong> {project.objective}</p>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Repository:</strong> <a href={project.repo} target="_blank" rel="noopener noreferrer">{project.repo}</a></p>
        <p><strong>Due Date:</strong> {project.dueDate}</p>
        <p><strong>Last Date to Apply:</strong> {project.lastDate}</p>
        <p><strong>Criteria:</strong> {project.criteria}</p>
        <p><strong>Status:</strong> {project.openStatus ? "Open" : "Closed"}</p>
        <p><strong>Mentor:</strong> {mentorName}</p>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
