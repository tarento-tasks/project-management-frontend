import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import ProjectCard from '../../components/ExploreCard/ExploreCard';
import RecommendedTag from '../../components/RecommendedTag/RecommendedTag';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        const [projectsData, skillsData] = await Promise.all([
          ExploreService.getProjects(),
          ExploreService.getAllSkills()
        ]);
  
        setProjects(projectsData);
        setAllSkills(skillsData);
  
        if (auth.isAuthenticated && auth.user?.id) {
          const [recommended, enrolled] = await Promise.all([
            ExploreService.getRecommendedProjects(auth.user.id),
            ExploreService.getEnrollmentsByStudent(auth.user.id)
          ]);
          
          setRecommendedProjects(recommended || []);
          setEnrolledProjects(new Set(enrolled.map(e => e.projectId)));
          setIsEnrolledReady(true);
        } else {
          setIsEnrolledReady(true);
        }
  
        setIsDataReady(true);
      } catch (err) {
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
       project.skillsRequired.toLowerCase().includes(skillFilter.toLowerCase()));

    return matchesSearch && matchesFilter && matchesSkill;
  });

  if (isLoading) return <div className={styles.loading}>Loading projects...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <GeneralLayout role="student">
      <div className={styles.container}>
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

        {!isDataReady ? (
          <div className={styles.loading}>Preparing data...</div>
        ) : filteredProjects.length === 0 ? (
          <div className={styles.noProjects}>No projects found matching your criteria.</div>
        ) : (
          <div className={styles.projectsGrid}>
            {isEnrolledReady && filteredProjects.map(project => (
              <div key={project.projectId} className={styles.projectWrapper}>
                {recommendedProjectIds.has(project.projectId) && (
                  <RecommendedTag />
                )}
                <ProjectCard
                  project={project}
                  isRecommended={recommendedProjectIds.has(project.projectId)}
                  isEnrolled={enrolledProjects.has(project.projectId)}
                  onEnrollSuccess={handleEnrollment}
                  studentId={auth.user?.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </GeneralLayout>
  );
};

export default StudentProjects;