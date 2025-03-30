// components/ProjectCard/ProjectCard.jsx
import styles from './projectCard.module.css';
import RecommendedTag from '../RecommendedTag/RecommendedTag';

const ProjectCard = ({ 
  project, 
  isRecommended, 
  onEnroll 
}) => {
  const today = new Date();
  const lastDate = new Date(project.lastDate);
  const isOpen = lastDate >= today;

  const handleEnrollClick = async () => {
    if (isOpen) {
      const result = await MySwal.fire({
        title: 'Confirm Enrollment',
        text: `Are you sure you want to enroll in "${project.title}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3e648b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, enroll!',
        cancelButtonText: 'Cancel'
      });
      
      if (result.isConfirmed) {
        try {
          await onEnroll(project.projectId);
          MySwal.fire(
            'Enrolled!',
            'You have successfully enrolled in the project.',
            'success'
          );
        } catch (error) {
          MySwal.fire(
            'Error',
            error.message || 'Failed to enroll in the project',
            'error'
          );
        }
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{project.title}</h3>
        {isRecommended && <RecommendedTag />}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Objective:</span>
            <span>{project.objective}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Eligibility:</span>
            <span>{project.criteria}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Skills:</span>
            <span>{project.skillsRequired}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.dates}>
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
          <span>Enroll by: {new Date(project.lastDate).toLocaleDateString()}</span>
        </div>
        <button 
          className={`${styles.enrollButton} ${!isOpen ? styles.disabled : ''}`}
          onClick={handleEnrollClick}
          disabled={!isOpen}
        >
          {isOpen ? 'Enroll' : 'Closed'}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;