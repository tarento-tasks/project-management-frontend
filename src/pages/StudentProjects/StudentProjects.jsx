import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ExploreService from '../../services/explore';
import styles from './studentProjects.module.css';

const StudentProjects = () => {
  const auth = useRecoilValue(authState);
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState(new Set());
  const [allSkills, setAllSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [skillFilter, setSkillFilter] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledProjects, setEnrolledProjects] = useState(new Set());
  const [isDataReady, setIsDataReady] = useState(false); // ✅ NEW
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
  
          setRecommendedProjects(new Set(recommended.map(p => p.projectId)));
          setEnrolledProjects(new Set(enrolled.map(e => e.projectId)));
          setIsEnrolledReady(true); // ✅ HERE
        } else {
          setIsEnrolledReady(true); // In case user is not logged in (optional)
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
  

  // Update enrolled projects locally after enroll action
  const handleEnrollment = (projectId) => {
    setEnrolledProjects((prev) => new Set([...prev, projectId]));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.objective?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterOption === 'recommended') {
      matchesFilter = recommendedProjects.has(project.projectId);
    } else if (filterOption === 'open') {
      const today = new Date();
      const lastDate = new Date(project.lastDate);
      matchesFilter = lastDate >= today && project.openStatus;
    }

    const matchesSkill =
      !skillFilter ||
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
  <ProjectCard
    key={project.projectId}
    project={project}
    isRecommended={recommendedProjects.has(project.projectId)}
    isEnrolled={enrolledProjects.has(project.projectId)}
    onEnrollSuccess={handleEnrollment}
    studentId={auth.user?.id}
  />
))}

          </div>
        )}
      </div>
    </GeneralLayout>
  );
};

export default StudentProjects;
