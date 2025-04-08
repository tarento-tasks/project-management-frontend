{/* // pages/StudentProjects/StudentProjects.jsx
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { ProjectService } from '../../services/api';
import styles from './studentProjects.module.css';

const StudentProjects = () => {
  const auth = useRecoilValue(authState);
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch all projects using ProjectService
        const projectsResponse = await ProjectService.getAllProjects();
        const projectsData = projectsResponse.data.data;
        
        // Filter open projects
        const currentDate = new Date();
        const openProjects = projectsData.filter(project => {
          const lastDate = new Date(project.lastDate);
          return lastDate >= currentDate && project.openStatus;
        });

        setProjects(openProjects);
        
        // Fetch recommended projects if authenticated
        if (auth.isAuthenticated && auth.user?.id) {
          try {
            const recommendedResponse = await ProjectService.getRecommendedProjects(auth.user.id);
            const recommendedData = recommendedResponse.data.data;
            setRecommendedProjects(new Set(recommendedData.map(p => p.projectId)));
          } catch (err) {
            console.error('Recommendations error:', err);
            // Silently fail recommendations
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch projects');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [auth]);

  const handleEnroll = async (projectId) => {
    try {
      await ProjectService.enrollInProject(projectId, auth.user?.id);
      // Success handled in ProjectCard via SweetAlert
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(
        new Error(err.response?.data?.message || 'Enrollment failed')
      );
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading projects...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <GeneralLayout role="student">
      <div className={styles.container}>
        <h1 className={styles.title}>Available Projects</h1>
        <p className={styles.subtitle}>Browse and enroll in projects that match your interests</p>
        
        {projects.length === 0 ? (
          <div className={styles.noProjects}>No open projects available at the moment.</div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map(project => (
              <ProjectCard
                key={project.projectId}
                project={project}
                isRecommended={recommendedProjects.has(project.projectId)}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>
    </GeneralLayout>
  );
};

export default StudentProjects;   

*/}

// pages/StudentProjects/StudentProjects.jsx
// pages/StudentProjects/StudentProjects.jsx
import { useState } from 'react';
import GeneralLayout from '../../layouts/GeneralLayout';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import Modal from '../../components/Modal/Modal';
import styles from './studentProjects.module.css';

const StudentProjects = () => {
 
  const dummyProjects = [
    {
      projectId: '1',
      title: 'AI Chatbot Development',
      description: 'Develop a chatbot using natural language processing to assist students with academic queries. The project will involve training ML models and creating a user-friendly interface.',
      objective: 'To create an intelligent assistant for student queries',
      criteria: 'Computer Science students with NLP knowledge',
      skillsRequired: 'Python, NLP, Machine Learning',
      dueDate: '2023-12-31',
      lastDate: '2023-11-15',
    },
    {
      projectId: '2',
      title: 'Campus Navigation App',
      description: 'Build a mobile application to help students navigate the university campus with indoor mapping and points of interest.',
      objective: 'Improve campus navigation experience',
      criteria: 'Any student with mobile development experience',
      skillsRequired: 'React Native, JavaScript, Firebase',
      dueDate: '2025-11-30',
      lastDate: '2025-10-20',
    },
    {
      projectId: '3',
      title: 'Library Management System',
      description: 'Redesign the university library management system with modern UI and additional features like book recommendations.',
      objective: 'Modernize library operations',
      criteria: 'CS/IT students with web development skills',
      skillsRequired: 'React, Node.js, MongoDB',
      dueDate: '2026-01-15',
      lastDate: '2025-12-01',
    },
    {
      projectId: '4',
      title: 'Student Wellness Tracker',
      description: 'Create an application to track student wellness metrics and provide personalized recommendations.',
      objective: 'Improve student health and wellness',
      criteria: 'Open to all students',
      skillsRequired: 'UI/UX Design, JavaScript, Data Visualization',
      dueDate: '2023-11-15',
      lastDate: '2023-10-01', // This project should show as closed
    },
    {
      projectId: '5',
      title: 'Virtual Lab Simulations',
      description: 'Develop virtual simulations for physics and chemistry laboratory experiments.',
      objective: 'Enhance remote learning experience',
      criteria: 'Physics/Chemistry/CS students',
      skillsRequired: 'Unity, 3D Modeling, Physics Engines',
      dueDate: '2024-02-28',
      lastDate: '2023-12-31',
    },
    {
      projectId: '6',
      title: 'Alumni Network Platform',
      description: 'Build a platform to connect current students with alumni for mentorship and career guidance.',
      objective: 'Strengthen alumni-student connections',
      criteria: 'Students interested in web development',
      skillsRequired: 'React, GraphQL, PostgreSQL',
      dueDate: '2024-03-15',
      lastDate: '2024-01-31',
    },
  ];


  const [recommendedProjects] = useState(new Set(['1', '3', '5']));
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [skillFilter, setSkillFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  const handleEnrollClick = (projectId) => {
    setSelectedProject(projectId);
    setIsModalOpen(true);
  };

  const confirmEnrollment = () => {
    setIsModalOpen(false);
    // Simulate API call
    setTimeout(() => {
      setEnrollmentStatus({
        success: true,
        message: 'Enrollment request sent successfully!'
      });
      // Clear status after 3 seconds
      setTimeout(() => setEnrollmentStatus(null), 3000);
    }, 1000);
  };

  const handleEnroll = (projectId) => {
    alert(`You would be enrolled in project ${projectId} (simulated)`);
  };

  

const allSkills = dummyProjects
.map(project => 
  (project.skillsRequired || '') 
  .split(',')
  .map(skill => skill.trim())
  .filter(skill => skill)
)
.reduce((acc, skills) => [...acc, ...skills], []) 
.filter((skill, index, self) => self.indexOf(skill) === index); 

  const filteredProjects = dummyProjects.filter(project => {

    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.objective.toLowerCase().includes(searchTerm.toLowerCase());
    
 
    let matchesFilter = true;
    if (filterOption === 'recommended') {
      matchesFilter = recommendedProjects.has(project.projectId);
    } else if (filterOption === 'open') {
      const today = new Date();
      const lastDate = new Date(project.lastDate);
      matchesFilter = lastDate >= today;
    }
    
    const matchesSkill = skillFilter === '' || 
      project.skillsRequired.toLowerCase().includes(skillFilter.toLowerCase());
    
    return matchesSearch && matchesFilter && matchesSkill;
  });

  return (
    <GeneralLayout role="student">
      <div className={styles.container}>
        {/* Success message */}
        {enrollmentStatus?.success && (
          <div className={styles.successMessage}>
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
                <option key={skill} value={skill}>{skill}</option>
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