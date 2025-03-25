import React from "react";
import PropTypes from "prop-types";
import styles from "./projectcard.module.css";
import { Card, Button, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import placeholderMentor from "./mentor-placeholder.png";
import placeholderTeammate from "./teammate-placeholder.png";

// Adjusted colors for a lighter background
const bigStoneColors = {
  cardBg: "#f0f4f8", // Light Gray for better contrast
  primary: "#517ea6",  // 500
  progressBar: "#3e648b", // 600
  sectionBg: "#e3eaf1",  // Softer shade for mentor/team sections
  button: "#2a3c50",  // 900
  text: "#2a3c50" // Darker text for readability
};

const ProjectCard = ({ 
  projectName, 
  projectDescription, 
  startDate, 
  endDate, 
  duration, 
  tasksLeft, 
  totalTasks,
  mentorName,
  teamMembers,
  projectStatus
}) => {
  const progress = ((totalTasks - tasksLeft) / totalTasks) * 100;

  return (
    <Card className={`shadow ${styles.projectCard}`} style={{ backgroundColor: bigStoneColors.cardBg, color: bigStoneColors.text }}>
      <Card.Body>
        {/* Project Title */}
        <Card.Title className="text-center fw-bold" style={{ color: bigStoneColors.primary }}>
          {projectName}
        </Card.Title>
        <Card.Text className="text-muted">{projectDescription}</Card.Text>

        {/* Start Date, End Date, and Duration */}
        <div className="d-flex justify-content-between mt-3">
          <div><strong>📅 Start:</strong> {startDate}</div>
          <div><strong>⏳ End:</strong> {endDate}</div>
        </div>
        <div className="text-left text-dark mt-2">
          <strong>📌 Duration:</strong> {duration}
        </div>

        {/* Mentor & Team Members Section */}
        <div className="mt-3 p-2 rounded" style={{ backgroundColor: bigStoneColors.sectionBg }}>
          <div className="text-center text-dark"><strong>👤 Mentor:</strong></div>
          <div className="d-flex align-items-center justify-content-center mt-2">
            <img src={placeholderMentor} alt="Mentor" className={styles.profilePic} />
            <span className="ms-2">{mentorName}</span>
          </div>
        </div>

        <div className="mt-3 p-2 rounded" style={{ backgroundColor: bigStoneColors.sectionBg }}>
          <div className="text-center text-dark"><strong>👥 Team Members:</strong></div>
          <div className="d-flex justify-content-center mt-2">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center mx-2">
                <img src={placeholderTeammate} alt={member} className={styles.profilePic} />
                <p className="small">{member}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status */}
        <div className="text-center mt-3">
          <span className={`badge ${projectStatus === "Completed" ? "bg-success" : "bg-warning"}`}>
            {projectStatus}
          </span>
        </div>

        {/* Task Progress Bar */}
        <div className="mt-3">
          <strong>📊 Task Progress:</strong>
          <ProgressBar 
            now={progress} 
            label={`${progress.toFixed(0)}%`} 
            className="mt-2"
            style={{ backgroundColor: bigStoneColors.progressBar }}
          />
        </div>

        
      </Card.Body>
    </Card>
  );
};

// PropTypes for validation
ProjectCard.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectDescription: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  tasksLeft: PropTypes.number.isRequired,
  totalTasks: PropTypes.number.isRequired,
  mentorName: PropTypes.string.isRequired,
  teamMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectStatus: PropTypes.string.isRequired,
 
};

export default ProjectCard;
