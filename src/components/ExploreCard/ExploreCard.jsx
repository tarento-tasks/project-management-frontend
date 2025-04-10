import { useState } from 'react';
import styles from './exploreCard.module.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ExploreService from '../../services/explore';

const MySwal = withReactContent(Swal);

// SVG Icons
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7"/>
  </svg>
);

const ProjectCard = ({ project, skills, isRecommended, isEnrolled, onEnrollSuccess, studentId }) => {
  const [expanded, setExpanded] = useState(false);
  const today = new Date();
  const lastDate = new Date(project.lastDate);
  const isOpen = lastDate >= today && project.openStatus;
  
  const daysRemaining = Math.ceil((lastDate - today) / (1000 * 60 * 60 * 24));
  
  const handleEnrollClick = async () => {
    if (!isOpen || !studentId) return;
    
    const result = await MySwal.fire({
      title: 'Confirm Enrollment',
      text: `Are you sure you want to enroll in "${project.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
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
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`${styles.card} ${expanded ? styles.expanded : ''} ${isRecommended ? styles.recommended : ''}`}>
      {/* Recommended ribbon */}
      {isRecommended && (
        <div className={styles.recommendedRibbon}>
          <SparkleIcon />
          <span>Recommended for you</span>
        </div>
      )}
      
      <div className={styles.cardContent}>
        <div className={styles.topSection}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{project.title}</h3>
            <div className={styles.statusIndicator}>
              {isEnrolled ? (
                <span className={styles.enrolledStatus}>
                  <span className={styles.iconWrapper}><AwardIcon /></span>
                  Enrolled
                </span>
              ) : isOpen ? (
                <span className={styles.openStatus}>
                  <span className={styles.iconWrapper}><ClockIcon /></span>
                  Open • {daysRemaining} days left
                </span>
              ) : (
                <span className={styles.closedStatus}>
                  <span className={styles.iconWrapper}><ClockIcon /></span>
                  Closed
                </span>
              )}
            </div>
          </div>
          
          <div className={styles.descriptionContainer}>
            <p className={styles.description}>{project.description}</p>
          </div>
          
          <div className={styles.skillsContainer}>
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill, index) => (
                <span key={index} className={styles.skillBadge}>
                  {skill.skillName}
                </span>
              ))
            ) : (
              <span className={styles.skillBadge}>
                {project.skillsRequired || 'No specific skills required'}
              </span>
            )}
          </div>
        </div>
        
        {expanded && (
          <div className={styles.detailsSection}>
            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <BookIcon />
              </div>
              <div className={styles.detailContent}>
                <h4 className={styles.detailTitle}>Objective</h4>
                <p className={styles.detailText}>{project.objective}</p>
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <AwardIcon />
              </div>
              <div className={styles.detailContent}>
                <h4 className={styles.detailTitle}>Eligibility</h4>
                <p className={styles.detailText}>{project.criteria}</p>
              </div>
            </div>
            
            <div className={styles.timelineSection}>
              <div className={styles.timelineItem}>
                <span className={styles.iconWrapper}><CalendarIcon /></span>
                <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className={styles.timelineItem}>
                <span className={styles.iconWrapper}><ClockIcon /></span>
                <span>Enroll by: {new Date(project.lastDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.footerButtonGroup}>
          <button 
            className={styles.expandButton} 
            onClick={toggleExpanded}
            aria-label={expanded ? "Show less" : "Show more"}
          >
            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            <span>{expanded ? "Show less" : "Show more"}</span>
          </button>
        </div>
        
        <div className={styles.footerButtonGroup}>
          {!isEnrolled && (
            <button
              className={`${styles.enrollButton} ${!isOpen ? styles.disabled : ''}`}
              onClick={handleEnrollClick}
              disabled={!isOpen || !studentId}
            >
              {isOpen ? "Enroll Now" : "Enrollment Closed"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;