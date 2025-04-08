import styles from './exploreCard.module.css';
import RecommendedTag from '../RecommendedTag/RecommendedTag';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ExploreService from '../../services/explore';

const MySwal = withReactContent(Swal);

const ProjectCard = ({ project, skills, isRecommended, isEnrolled, onEnrollSuccess, studentId }) => {
  const today = new Date();
  const lastDate = new Date(project.lastDate);
  const isOpen = lastDate >= today && project.openStatus;

  const handleEnrollClick = async () => {
    if (!isOpen || !studentId) return;

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
        await ExploreService.enrollInProject(project.projectId, studentId);
        onEnrollSuccess(project.projectId);
        MySwal.fire('Enrolled!', 'Enrollment request sent successfully.', 'success');
      } catch (error) {
        MySwal.fire('Error', error.response?.data?.message || 'Failed to enroll.', 'error');
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
            <div className={styles.skillTags}>
              {skills && skills.length > 0 ? (
                <span className={styles.skillTag}>
                {skills.map(skill => skill.skillName).join(', ')}
              </span>
              
              ) : (
                <span>{project.skillsRequired || 'None specified'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.dates}>
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
          <span>Enroll by: {new Date(project.lastDate).toLocaleDateString()}</span>
        </div>
        {isEnrolled ? (
          <button className={styles.enrolledButton} disabled>
            Enrolled
          </button>
        ) : isOpen ? (
          <button
            className={styles.enrollButton}
            onClick={handleEnrollClick}
          >
            Enroll
          </button>
        ) : (
          <button className={`${styles.enrollButton} ${styles.disabled}`} disabled>
            Closed
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;