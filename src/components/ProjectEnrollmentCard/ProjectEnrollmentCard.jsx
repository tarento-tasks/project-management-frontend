import React from "react";
import styles from "./projectenrollmentcard.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ProjectEnrollmentCard = ({ 
  title, 
  objective, 
  description, 
  prerequisites, 
  mentor, 
  lastDate 
}) => {
  return (
    <div className={`${styles.card} card shadow-lg`}>
      <div className={`card-header ${styles.cardHeader}`}>
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className={`card-body ${styles.cardBody}`}>
        <div className={styles.inputGroup}>
          <label>Objective:</label>
          <input type="text" className={`form-control ${styles.inputField}`} value={objective} readOnly />
        </div>
        <div className={styles.inputGroup}>
          <label>Description:</label>
          <input type="text" className={`form-control ${styles.inputField}`} value={description} readOnly />
        </div>
        <div className={styles.inputGroup}>
          <label>Prerequisites:</label>
          <input type="text" className={`form-control ${styles.inputField}`} value={prerequisites} readOnly />
        </div>
        <div className={styles.inputGroup}>
          <label>Mentor:</label>
          <input type="text" className={`form-control ${styles.inputField}`} value={mentor} readOnly />
        </div>
        <div className={styles.inputGroup}>
          <label>Last Date to Enroll:</label>
          <input type="text" className={`form-control ${styles.inputField}`} value={lastDate} readOnly />
        </div>
        <button className={`btn ${styles.enrollButton} mt-3`}>
  Enroll
</button>

      </div>
    </div>
  );
};

export default ProjectEnrollmentCard;
