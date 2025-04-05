// pages/StudentProjects/StudentProjects.jsx
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import Modal from '../../components/Modal/Modal';
import ExploreService from '../../services/explore';
import styles from './studentProjects.module.css';

const StudentProjects = () => {
  const auth = useRecoilValue(authState);
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState(new Set());
  const [allSkills, setAllSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [skillFilter, setSkillFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all projects
        const projectsData = await ExploreService.getProjects();
        
        // Fetch recommended projects if authenticated
        if (auth.isAuthenticated && auth.user?.id) {
          try {
            const recommendedData = await ExploreService.getRecommendedProjects(auth.user.id);
            setRecommendedProjects(new Set(recommendedData.map(p => p.projectId)));
          } catch (err) {
            console.error('Recommendations error:', err);
            // Silently fail recommendations
          }
        }
        
        // Fetch all skills for filter
        const skillsData = await ExploreService.getAllSkills();
        setAllSkills(skillsData);
        
        setProjects(projectsData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [auth]);

  const handleEnrollClick = (projectId) => {
    setSelectedProject(projectId);
    setIsModalOpen(true);
  };

  const confirmEnrollment = async () => {
    try {
      if (!selectedProject || !auth.user?.id) return;
      
      await ExploreService.enrollInProject(selectedProject, auth.user.id);
      setIsModalOpen(false);
      setEnrollmentStatus({
        success: true,
        message: 'Enrollment successful!'
      });
      
      // Clear status after 3 seconds
      setTimeout(() => setEnrollmentStatus(null), 3000);
    } catch (error) {
      setIsModalOpen(false);
      setEnrollmentStatus({
        success: false,
        message: error.message || 'Enrollment failed'
      });
      setTimeout(() => setEnrollmentStatus(null), 3000);
    }
  };

  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.objective && project.objective.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter option (all/recommended/open)
    let matchesFilter = true;
    if (filterOption === 'recommended') {
      matchesFilter = recommendedProjects.has(project.projectId);
    } else if (filterOption === 'open') {
      const today = new Date();
      const lastDate = new Date(project.lastDate);
      matchesFilter = lastDate >= today && project.openStatus;
    }
    
    // Skill filter
    const matchesSkill = skillFilter === '' || 
      (project.skillsRequired && 
       project.skillsRequired.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter && matchesSkill;
  });

  if (isLoading) return <div className={styles.loading}>Loading projects...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <GeneralLayout role="student">
      <div className={styles.container}>
        {/* Success/error message */}
        {enrollmentStatus && (
          <div className={enrollmentStatus.success ? styles.successMessage : styles.errorMessage}>
            {enrollmentStatus.message}
          </div>
        )}

        <h1 className={styles.title}>Available Projects</h1>
        <p className={styles.subtitle}>Browse and enroll in projects that match your interests</p>
        
        <div className={styles.searchFilterContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          
          <div className={styles.filterGroup}>
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Projects</option>
              <option value="recommended">Recommended</option>
              <option value="open">Open for Enrollment</option>
            </select>
            
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill.skillId} value={skill.name}>{skill.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredProjects.length === 0 ? (
          <div className={styles.noProjects}>
            No projects found matching your criteria.
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.projectId}
                project={project}
                isRecommended={recommendedProjects.has(project.projectId)}
                onEnroll={handleEnrollClick}
              />
            ))}
          </div>
        )}
        
        {/* Enrollment Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Enrollment"
        >
          <div className={styles.modalContent}>
            <p>Are you sure you want to enroll in this project?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton} 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={confirmEnrollment}
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </GeneralLayout>
  );
};

export default StudentProjects;