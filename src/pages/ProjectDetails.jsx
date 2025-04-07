// src/pages/ProjectDetails/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GeneralLayout from "../layouts/GeneralLayout";

const API_URL = "http://localhost:8080/api/projects";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_URL}/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProject(res.data.response))
      .catch((err) => console.error("Error fetching project:", err));
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

  return (
    <GeneralLayout>
      <div style={{ padding: "20px" }}>
        <h1>{project.title}</h1>
        <p><strong>Objective:</strong> {project.objective}</p>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Due Date:</strong> {project.dueDate}</p>
        <p><strong>Repository:</strong> <a href={project.repo} target="_blank" rel="noreferrer">{project.repo}</a></p>
      </div>
    </GeneralLayout>
  );
};

export default ProjectDetails;
