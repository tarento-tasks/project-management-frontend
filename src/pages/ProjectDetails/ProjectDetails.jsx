import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../layouts/GeneralLayout";
import styles from "./projectDetails.module.css";
 
const API_URL = "http://localhost:8080/api/projects";
const USERS_API = "http://localhost:8080/api/users";
const ENROLLMENT_API = "http://localhost:8080/api/project-enrollment/approved-students";
const TASKS_API = "http://localhost:8080/api/tasks";
 
 
const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [mentorName, setMentorName] = useState("Loading...");
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchApprovedStudents(projectId);
      fetchTasksForProject(projectId);
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
  
      console.log("✅ Mentor API Full Response:", response);
  
      if (response.data) {
        setMentorName(response.data.response?.name || "Unknown Mentor");
      } else {
        setMentorName("Unknown Mentor");
      }
    } catch (error) {
      console.error("❌ Error fetching mentor details:", error);
      setMentorName("Unknown Mentor");
    }
  };
 
 
  
 
  const fetchApprovedStudents = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ENROLLMENT_API}?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Log response to understand its shape
      console.log("✅ Approved Students Response:", response);
  
      // This assumes the backend wraps the list inside a 'response' field
      const students = response.data.response || [];
      setApprovedStudents(students);
    } catch (err) {
      console.error("Error fetching approved students:", err);
      setApprovedStudents([]); // fallback to empty list on error
    }
  };
  
 
  const fetchTasksForProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${TASKS_API}?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.response) {
        setTasks(response.data.response);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };
  
  
  
  if (loading) return <div className={styles.loading}>Loading project...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!project) return <div className={styles.noData}>No project found.</div>;
 
  return (
    <DashboardLayout>
  <div className={styles.container}>
    {loading ? (
      <p className={styles.loading}>Loading project details...</p>
    ) : error ? (
      <p className={styles.error}>{error}</p>
    ) : project ? (
      <>
        <h1 className={styles.heading}>{project.title}</h1>
 
        <div className={styles.infoGrid}>
          <div>
            <p><strong>Objective:</strong> {project.objective}</p>
            <p><strong>Description:</strong> {project.description}</p>
            <p>
              <strong>Repository:</strong>{" "}
              <a href={project.repo} target="_blank" rel="noopener noreferrer">
                {project.repo}
              </a>
            </p>
            <p><strong>Start Date:</strong> {project.lastDate}</p>
            <p><strong>Due Date:</strong> {project.dueDate}</p>
            <p><strong>Criteria:</strong> {project.criteria}</p>
            <p><strong>Status:</strong> {project.openStatus ? "Open" : "Closed"}</p>
            <p><strong>Mentor:</strong> {mentorName}</p>
          </div>
 
          <div>
            <p><strong>Team Members:</strong></p>
            {approvedStudents.length > 0 ? (
              <ul className={styles.inlineList}>
                {approvedStudents.map((student) => (
                  <li key={student.userId}>
                    {student.name} ({student.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No approved students.</p>
            )}
          </div>
        </div>
 
        <h3 className={styles.sectionTitle}>Project Tasks</h3>
        {tasks.length > 0 ? (
          <table className={styles.taskTable}>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Objective</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.taskId}>
                  <td>{task.taskName}</td>
                  <td>{task.taskObjective || "N/A"}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</td>
                  <td>{task.completeStatus || "Not marked"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks assigned yet.</p>
        )}
      </>
    ) : null}
  </div>
</DashboardLayout>
 
  
  );
  
};
 
export default ProjectDetails;