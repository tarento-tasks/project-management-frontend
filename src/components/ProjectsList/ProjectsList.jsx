import React from 'react';
import styles from './projectsList.module.css';

const ProjectsList = ({ projects }) => {
  const currentDate = new Date();

  return (
    <div className={styles.projectsGrid}>
      {projects
        .filter(project => new Date(project.lastDate) > currentDate) 
        .map(project => (
          <div key={project.id} className={styles.projectCard}>
            <h3>{project.title}</h3>
            <p className={styles.projectObjective}>{project.objective}</p>
            
            <div className={styles.projectMeta}>
              <span><strong>Mentor:</strong> {project.mentor}</span>
              <span><strong>Skills:</strong> {project.skills.join(', ')}</span>
            </div>
            
            <div className={styles.projectDates}>
              <span>Enroll by: {new Date(project.lastDate).toLocaleDateString()}</span>
              <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
            </div>
            
            <button className={styles.viewButton}>Enroll</button>
          </div>
        ))}
    </div>
  );
};

export default ProjectsList;