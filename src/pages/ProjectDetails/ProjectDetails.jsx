import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "./projectDetails.module.css";
import axios from "axios";

const API_URL = "http://localhost:8080/api/projects"; // Project API
const USERS_API = "http://localhost:8080/api/users"; // Users API
const APPROVED_STUDENTS_API = "http://localhost:8080/api/approved-students"; // Correct API

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [mentorName, setMentorName] = useState("Not Assigned");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Fetch project details
  const fetchProjectDetails = async () => {
    console.log("Fetching project details for ID:", projectId);

    try {
      const response = await axios.get(`${API_URL}/${projectId}`);
      console.log("✅ Project API Response:", response.data);

      if (response.data && response.data.response) {
        const projectData = response.data.response;
        setProject(projectData);

        // Fetch mentor name if mentorId exists
        if (projectData.mentorId) {
          fetchMentorName(projectData.mentorId);
        }

        // Fetch approved students for the project
        fetchApprovedStudents(projectId);
      } else {
        console.error("⚠️ Project data missing in API response:", response.data);
        setError("Invalid project data received.");
      }
    } catch (error) {
      console.error("❌ Error fetching project details:", error);
      setError("Failed to load project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch mentor name using mentorId
  const fetchMentorName = async (mentorId) => {
    console.log(`Fetching mentor details for ID: ${mentorId}`);

    try {
      const response = await axios.get(`${USERS_API}?userId=${mentorId}`);
      console.log("✅ Mentor API Response:", response.data);

      if (response.data && response.data.response) {
        setMentorName(response.data.response.name || "Unknown Mentor");
      } else {
        setMentorName("Unknown Mentor");
      }
    } catch (error) {
      console.error("❌ Error fetching mentor details:", error);
      setMentorName("Unknown Mentor");
    }
  };

  // Fetch approved students for the project
  const fetchApprovedStudents = async (projectId) => {
    console.log(`Fetching approved students for project ID: ${projectId}`);

    try {
      const response = await axios.get(`${APPROVED_STUDENTS_API}?projectId=${projectId}`);
      console.log("✅ Approved Students API Response:", response.data);

      if (response.data && response.data.response) {
        setStudents(response.data.response);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("❌ Error fetching approved students:", error);
      setStudents([]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!project) return <div className={styles.error}>Project not found.</div>;

  const formatDate = (dateStr) => (dateStr ? dateStr.split("-").reverse().join("-") : "N/A");

  return (
    <DashboardLayout>
      <div className={styles.projectDetailsContainer}>
        <h2>{project.title || "No Title"}</h2>
        <p>
          <strong>Description:</strong> {project.description || "No description available"}
        </p>
        <p>
          <strong>Start Date:</strong> {formatDate(project.lastDate)}
        </p>
        <p>
          <strong>Due Date:</strong> {formatDate(project.dueDate)}
        </p>
        <p>
          <strong>Status:</strong> {project.projectStatus || "Unknown"}
        </p>
        <p>
          <strong>Mentor:</strong> {mentorName}
        </p>
        <p>
          <strong>Repository:</strong>{" "}
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              {project.repo}
            </a>
          ) : (
            "No repository available"
          )}
        </p>

        {/* Display approved students */}
        <div className={styles.enrolledStudents}>
          <h3>Project Members</h3>
          {students.length > 0 ? (
            <ul>
              {students.map((student) => (
                <li key={student.userId}>
                  {student.name} - {student.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No approved students yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
