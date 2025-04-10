import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSearch, FaFilter, FaUserTie, FaBook, FaInfoCircle } from 'react-icons/fa';
import {
  getEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
  getRecommendedStudents,
  getStudentSkills
} from '../../services/enrollmentService';
import Modal from '../../components/Modal/Modal';
import styles from './enrollments.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const EnrollmentPage = () => {
  const auth = useRecoilValue(authState);
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [recommendedStudents, setRecommendedStudents] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [studentSkills, setStudentSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
 
  // Color palette
  const colors = {
    primary: '#517ea6',
    secondary: '#3e648b',
    dark: '#2a3c50',
    light: '#f8f9fa',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545'
  };
 
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        let response;
        
        if (auth.role === 'ADMIN') {
          response = await getEnrollments();
        } else if (auth.role === 'STUDENT') {
          response = await getEnrollments(null, auth.userId);
        }
        
        setEnrollments(response || []);
        setFilteredEnrollments(response || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch enrollments');
        toast.error(err.message || 'Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };
 
    if (auth.isAuthenticated) {
      fetchEnrollments();
    }
  }, [auth]);
 
  useEffect(() => {
    const fetchSkillsForStudent = async () => {
      if (selectedEnrollment?.student?.userId) {
        setLoadingSkills(true);
        try {
          const skills = await getStudentSkills(selectedEnrollment.student.userId);
          setStudentSkills(skills);
        } catch (err) {
          console.error('Error fetching skills:', err);
          setStudentSkills([]);
        } finally {
          setLoadingSkills(false);
        }
      }
    };
 
    fetchSkillsForStudent();
  }, [selectedEnrollment]);
 
  useEffect(() => {
    let results = enrollments;
    
    if (statusFilter !== 'ALL') {
      results = results.filter(e => e.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(e => {
        if (auth.role === 'ADMIN') {
          return (
            e.student?.name?.toLowerCase().includes(term) ||
            e.project?.title?.toLowerCase().includes(term) ||
            e.project?.objective?.toLowerCase().includes(term)
          );
        } else {
          return (
            e.project?.title?.toLowerCase().includes(term) ||
            e.project?.mentor?.name?.toLowerCase().includes(term)
          );
        }
      });
    }
    
    setFilteredEnrollments(results);
  }, [enrollments, statusFilter, searchTerm, auth.role]);
 
  const handleRowClick = async (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
    if (auth.role === 'ADMIN') {
      await fetchRecommendedStudents(enrollment.project?.projectId);
    }
  };
 
  const fetchRecommendedStudents = async (projectId) => {
    try {
      if (!projectId) return;
      const response = await getRecommendedStudents(projectId);
      setRecommendedStudents(response || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };
 
  const handleStatusUpdate = async (status) => {
    try {
      setEnrollments(prev => prev.map(e =>
        e.enrollmentId === selectedEnrollment.enrollmentId
          ? { ...e, status }
          : e
      ));
      
      setIsModalOpen(false);
      await updateEnrollmentStatus(selectedEnrollment.enrollmentId, status);
      toast.success(`Enrollment ${status.toLowerCase()} successfully!`);
    } catch (err) {
      setEnrollments(prev => prev.map(e =>
        e.enrollmentId === selectedEnrollment.enrollmentId
          ? { ...e, status: selectedEnrollment.status }
          : e
      ));
      toast.error(`Failed to update status: ${err.message}`);
    }
  };
 
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    
    try {
      const deletedId = selectedEnrollment.enrollmentId;
      setEnrollments(prev => prev.filter(e => e.enrollmentId !== deletedId));
      setIsModalOpen(false);
      await deleteEnrollment(deletedId);
      toast.success('Enrollment deleted successfully!');
    } catch (err) {
      setEnrollments(prev => [...prev, selectedEnrollment]);
      toast.error(`Failed to delete enrollment: ${err.message}`);
    }
  };
 
  if (loading) return <GeneralLayout>Loading...</GeneralLayout>;
  if (error) return <GeneralLayout>Error: {error}</GeneralLayout>;
 
  return (
    <GeneralLayout>
      <div className={styles.container} style={{ backgroundColor: colors.background }}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title} style={{ color: colors.dark }}>
            {auth.role === 'ADMIN' ? 'Enrollment Requests' : 'My Applications'}
            <span className={styles.titleDivider}></span>
          </h1>
          
        </div>
        
        <div className={styles.filterContainer}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} style={{ color: colors.muted }} />
            <input
              type="text"
              placeholder={auth.role === 'ADMIN' ? "Search by student or project..." : "Search by project..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderColor: colors.secondary,
                color: colors.text
              }}
            />
          </div>
          <div className={styles.statusFilter}>
            <FaFilter className={styles.filterIcon} style={{ color: colors.muted }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                borderColor: colors.secondary,
                color: colors.text
              }}
            >
              <option value="ALL">Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
 
        
        <div className={styles.tableContainer}>
          <table className={styles.enrollmentTable}>
            <thead>
              <tr style={{ backgroundColor: colors.secondary, color: 'white' }}>
                {auth.role === 'ADMIN' ? (
                  <>
                    <th>Student Name</th>
                    <th>Project Title</th>
                    <th>Project Objective</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Project Title</th>
                    <th>Mentor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enrollment) => (
                  <tr
                    key={enrollment.enrollmentId}
                    onClick={() => handleRowClick(enrollment)}
                    className={styles.tableRow}
                    
                  >
                    {auth.role === 'ADMIN' ? (
                      <>
                        <td>{enrollment.student?.name}</td>
                        <td>{enrollment.project?.title}</td>
                        <td>{enrollment.project?.objective || 'N/A'}</td>
                        <td>
                          <span className={`${styles.status} ${styles[enrollment.status?.toLowerCase()]}`}>
                            {enrollment.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(enrollment);
                            }}
                            className={styles.viewButton}
                            style={{ backgroundColor: colors.primary }}
                          >
                            View
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{enrollment.project?.title}</td>
                        <td>{enrollment.project?.mentor?.name || 'N/A'}</td>
                        <td>
                          <span className={`${styles.status} ${styles[enrollment.status?.toLowerCase()]}`}>
                            {enrollment.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(enrollment);
                            }}
                            className={styles.viewButton}
                            style={{ backgroundColor: colors.primary }}
                          >
                            View
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={auth.role === 'ADMIN' ? 5 : 4} className={styles.emptyMessage}>
                    No enrollments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
 
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Enrollment Details - ${selectedEnrollment?.status || ''}`}
          titleStyle={{ color: colors.dark, fontWeight: '600' }}
          style={{ borderRadius: '16px', padding: '1.5rem', maxWidth: '800px' }}
        >
          {selectedEnrollment && (
            <div className={styles.modalContent}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailSection}>
                  <h3 style={{ color: colors.primary, marginBottom: '0.5rem' }}>Student Information</h3>
                  <p><strong>Name:</strong> {selectedEnrollment.student?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedEnrollment.student?.email || 'N/A'}</p>
                  
                  <div className={styles.skillsSection}>
                    <strong>Skills:</strong>
                    {loadingSkills ? (
                      <div className={styles.loadingSkills}>Loading skills...</div>
                    ) : studentSkills.length > 0 ? (
                      <div className={styles.skillBadges}>
                        {studentSkills.map(skill => (
                          <span key={skill} className={styles.skillBadge}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span>No skills listed</span>
                    )}
                  </div>
                  
                  <p><strong>Qualifications:</strong> {selectedEnrollment.student?.qualifications || 'N/A'}</p>
                  <p><strong>Previous Work:</strong> {selectedEnrollment.student?.previousWork || 'N/A'}</p>
                </div>
                
                <div className={styles.detailSection}>
                  <h3 style={{ color: colors.primary, marginBottom: '0.5rem' }}>Project Information</h3>
                  <p><strong>Title:</strong> {selectedEnrollment.project?.title || 'N/A'}</p>
                  <p><strong>Description:</strong> {selectedEnrollment.project?.description || 'N/A'}</p>
                  <p><strong>Objective:</strong> {selectedEnrollment.project?.objective || 'N/A'}</p>
                  <p><strong>Mentor:</strong> {selectedEnrollment.project?.mentor?.name || 'N/A'}</p>
                  
                  <div className={styles.criteriaSection}>
                    <strong>Eligibility Criteria:</strong>
                    {selectedEnrollment.project?.criteria ? (
                      <ul className={styles.criteriaList}>
                        {selectedEnrollment.project.criteria.split('\n').map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No specific criteria</span>
                    )}
                  </div>
                  
                  <p><strong>Status:</strong>
                    <span className={`${styles.status} ${styles[selectedEnrollment.status?.toLowerCase()]}`}>
                      {selectedEnrollment.status || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
 
              {auth.role === 'ADMIN' && (
                <div className={styles.recommendationSection}>
                  <button
                    onClick={() => setShowRecommendations(!showRecommendations)}
                    className={styles.recommendationButton}
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                      color: 'white'
                    }}
                  >
                    <span>{showRecommendations ? 'Hide Recommendations' : 'Show Recommended Students'}</span>
                    <i className={`bi bi-chevron-${showRecommendations ? 'up' : 'down'}`}></i>
                  </button>
                  
                  {showRecommendations && (
                    <div className={styles.recommendationContainer}>
                      {recommendedStudents.length > 0 ? (
                        <div className={styles.studentCards}>
                          {recommendedStudents.map(student => (
                            <div key={student.userId} className={styles.studentCard}>
                              <div className={styles.studentAvatar}>
                                {student.imageBase64 ? (
                                  <img src={student.imageBase64} alt={student.name} />
                                ) : (
                                  <div className={styles.avatarPlaceholder}>
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className={styles.studentInfo}>
                                <h4>{student.name}</h4>
                                <p className={styles.studentEmail}>{student.email}</p>
                                <div className={styles.skillBadges}>
                                  {student.skills?.map(skill => (
                                    <span key={skill} className={styles.skillBadge}>
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <i className="bi bi-info-circle"></i>
                          <p>No recommendations available for this project</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
 
              <div className={styles.modalActions}>
                {auth.role === 'ADMIN' && selectedEnrollment.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('APPROVED')}
                      className={`${styles.actionButton} ${styles.approve}`}
                      style={{
                        background: `linear-gradient(135deg, #28a745 0%, #218838 100%)`,
                        color: 'white'
                      }}
                    >
                      <FaCheckCircle className={styles.icon} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('REJECTED')}
                      className={`${styles.actionButton} ${styles.reject}`}
                      style={{
                        background: `linear-gradient(135deg, #dc3545 0%, #c82333 100%)`,
                        color: 'white'
                      }}
                    >
                      <FaTimesCircle className={styles.icon} />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className={`${styles.actionButton} ${styles.delete}`}
                  style={{
                    background: `linear-gradient(135deg, #ffc107 0%, #e0a800 100%)`,
                    color: '#212529'
                  }}
                >
                  <FaTrashAlt className={styles.icon} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </GeneralLayout>
  );
};
 
export default EnrollmentPage;
 