import React from "react";
import PropTypes from "prop-types";
import styles from "./projectcard.module.css";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import placeholderMentor from "./mentor-placeholder.png";

const ProjectCard = ({ title, description, lastDate, dueDate,/* mentorId,*/ repo }) => {
  return (
    <Card className={styles.projectCard}>
      <Card.Body>
        <Card.Title className="text-center fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted">{description}</Card.Text>

        <div className="d-flex justify-content-between mt-3">
          <div><strong>📅 Start:</strong> {lastDate || "N/A"}</div>
          <div><strong>⏳ End:</strong> {dueDate || "N/A"}</div>
        </div>

     
 {/* Repository Link */}
 {repo && (
          <div className="mt-3">
            <strong>🔗 Repository:</strong>{" "}
            <a href={repo} target="_blank" rel="noopener noreferrer">
              {repo}
            </a>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  lastDate: PropTypes.string,
  dueDate: PropTypes.string,
 // mentorId: PropTypes.string,
 // projectStatus: PropTypes.string.isRequired,
 repo: PropTypes.string, 
};

export default ProjectCard;
