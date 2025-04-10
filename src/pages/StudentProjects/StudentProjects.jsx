import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import ProjectCard from '../../components/ExploreCard/ExploreCard';
import ExploreService from '../../services/explore';
import styles from './studentProjects.module.css';

const StudentProjects = () => {
  const auth = useRecoilValue(authState);
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]); 
  const [allSkills, setAllSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [skillFilter, setSkillFilter] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledProjects, setEnrolledProjects] = useState(new Set());
  const [isDataReady, setIsDataReady] = useState(false);
  const [isEnrolledReady, setIsEnrolledReady] = useState(false);
  const [projectSkillsMap, setProjectSkillsMap] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get student ID from auth or local storage
        const studentId = auth.isAuthenticated && auth.user?.id 
          ? auth.user.id 
          : localStorage.getItem('userId'); 
        
        console.log("Current student ID:", studentId);
  
        const [projectsData, skillsData] = await Promise.all([
          ExploreService.getProjects(),
          ExploreService.getAllSkills()
        ]);
  
        console.log("Fetched projects:", projectsData.length);
        setProjects(projectsData);
        setAllSkills(skillsData);
  
        // Fetch skills for each project
        const skillsPromises = projectsData.map(project => 
          ExploreService.getProjectSkills(project.projectId)
        );
        
        const projectSkillsResults = await Promise.all(skillsPromises);
        
        // Create a map of projectId -> skills
        const skillsMap = {};
        projectsData.forEach((project, index) => {
          skillsMap[project.projectId] = projectSkillsResults[index] || [];
        });
        
        setProjectSkillsMap(skillsMap);
  
        if (studentId) {
          console.log("Fetching recommendations for student:", studentId);
          
          try {
            const recommended = await ExploreService.getRecommendedProjects(studentId);
            console.log("Recommended projects response:", recommended);
            setRecommendedProjects(recommended || []);
          } catch (recError) {
            console.error("Error fetching recommendations:", recError);
          }
          
          try {
            const enrolled = await ExploreService.getEnrollmentsByStudent(studentId);
            console.log('Enrolled project IDs:', enrolled);
            setIsEnrolledReady(true);
            
            // Filter out any undefined/null values and create a Set
            const enrolledSet = new Set(enrolled.filter(id => id));
            setEnrolledProjects(enrolledSet);
          } catch (enrollError) {
            console.error("Error fetching enrollments:", enrollError);
            setEnrolledProjects(new Set());
          }
        } else {
          console.warn("No student ID available for recommendations");
          setIsEnrolledReady(true);
        }
  
        setIsDataReady(true);
      } catch (err) {
        console.error("Main fetch error:", err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [auth]);

  // Create a Set of recommended project IDs for easy checking
  const recommendedProjectIds = new Set(recommendedProjects.map(p => p.projectId));
  
  const handleEnrollment = (projectId) => {
    setEnrolledProjects((prev) => new Set([...prev, projectId]));
  };

  const filteredProjects = projects.filter(project => {
    // Search filter - matches title, description, or objective
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.objective && project.objective.toLowerCase().includes(searchTerm.toLowerCase()));

    // Main filter options
    let matchesFilter = true;
    if (filterOption === 'recommended') {
      matchesFilter = recommendedProjectIds.has(project.projectId);
    } else if (filterOption === 'open') {
      const today = new Date();
      const lastDate = new Date(project.lastDate);
      matchesFilter = lastDate >= today && project.openStatus;
    }

    // Skill filter
    const matchesSkill = skillFilter === '' || 
      (project.skillsRequired && 
       project.skillsRequired.toLowerCase().includes(skillFilter.toLowerCase())) ||
      projectSkillsMap[project.projectId]?.some(skill => 
        skill.skillName.toLowerCase().includes(skillFilter.toLowerCase())
      );

    return matchesSearch && matchesFilter && matchesSkill;
  });

  // Function to get count of projects by type
  const getProjectCount = (type) => {
    if (type === 'recommended') {
      return recommendedProjects.length;
    } else if (type === 'enrolled') {
      return enrolledProjects.size;
    } else if (type === 'open') {
      const today = new Date();
      return projects.filter(p => 
        new Date(p.lastDate) >= today && p.openStatus
      ).length;
    }
    return projects.length; // all
  };

  if (isLoading) {
    return (
      <GeneralLayout role="student">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading projects...</p>
        </div>
      </GeneralLayout>
    );
  }
  
  if (error) {
    return (
      <GeneralLayout role="student">
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>❌</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </GeneralLayout>
    );
  }

  return (
    <GeneralLayout role="student">
      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.mainTitle}>Discover Projects</h1>
            <p className={styles.heroText}>
              Explore opportunities to enhance your skills and build your portfolio
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{getProjectCount('all')}</span>
            <span className={styles.statLabel}>Total Projects</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{getProjectCount('recommended')}</span>
            <span className={styles.statLabel}>Recommended</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{getProjectCount('enrolled')}</span>
            <span className={styles.statLabel}>Enrolled</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{getProjectCount('open')}</span>
            <span className={styles.statLabel}>Open Projects</span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className={styles.controlPanel}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search by title, description or objective..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button 
                className={styles.clearButton}
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.filtersGroup}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Category:</label>
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Projects</option>
                <option value="recommended">Recommended for You</option>
                <option value="open">Open for Enrollment</option>
              </select>
            </div>

            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Skills:</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Any Skill</option>
                {allSkills.map(skill => (
                  <option key={skill.skillId} value={skill.name}>{skill.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {filterOption === 'all' ? 'All Projects' : 
               filterOption === 'recommended' ? 'Recommended Projects' : 
               'Open Projects'}
            </h2>
            <span className={styles.resultsCount}>
              Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>

          {!isDataReady ? (
            <div className={styles.loadingPlaceholder}>
              <div className={styles.loadingSpinner}></div>
              <p>Preparing data...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No matching projects found</h3>
              <p>Try adjusting your search or filter criteria</p>
              {(searchTerm || filterOption !== 'all' || skillFilter) && (
                <button 
                  className={styles.resetButton}
                  onClick={() => {
                    setSearchTerm('');
                    setFilterOption('all');
                    setSkillFilter('');
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {isEnrolledReady && filteredProjects.map(project => (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  skills={projectSkillsMap[project.projectId] || []}
                  isRecommended={recommendedProjectIds.has(project.projectId)}
                  isEnrolled={enrolledProjects.has(project.projectId)}
                  onEnrollSuccess={handleEnrollment}
                  studentId={auth.user?.id || localStorage.getItem('userId')} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default StudentProjects;