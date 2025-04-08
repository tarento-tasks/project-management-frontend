import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt } from 'react-icons/fa';

import { 
  getEnrollments, 
  updateEnrollmentStatus,
  deleteEnrollment,
  getRecommendedStudents
} from '../../services/enrollmentService';
import ButtonComponent from '../../components/Buttons/ButtonComponent';
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
    let results = enrollments;
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      results = results.filter(e => e.status === statusFilter);
    }
    
    // Apply search filter
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

  const handleRowClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
    if (auth.role === 'ADMIN') {
      fetchRecommendedStudents(enrollment.project?.projectId);
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
      const updatedEnrollment = await updateEnrollmentStatus(
        selectedEnrollment.enrollmentId, 
        status
      );
      
      setEnrollments(prev => prev.map(e => 
        e.enrollmentId === updatedEnrollment.enrollmentId ? updatedEnrollment : e
      ));
      
      setIsModalOpen(false);
      toast.success(`Enrollment ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    
    try {
      await deleteEnrollment(selectedEnrollment.enrollmentId);
      setEnrollments(prev => prev.filter(e => e.enrollmentId !== selectedEnrollment.enrollmentId));
      setIsModalOpen(false);
      toast.success('Enrollment deleted successfully!');
    } catch (err) {
      console.error('Error deleting enrollment:', err);
      toast.error(`Failed to delete enrollment: ${err.message}`);
    }
  };

  if (loading) return <GeneralLayout>Loading...</GeneralLayout>;
  if (error) return <GeneralLayout>Error: {error}</GeneralLayout>;

  return (
    <GeneralLayout>
      <div className={styles.container} style={{ backgroundColor: colors.light }}>
        <h1 className={`${styles.title} bungee-inline-regular`} style={{ color: colors.dark }}>
          {auth.role === 'ADMIN' ? 'Enrollment Requests Dashboard' : 'My Project Applications'}
        </h1>
        
        <div className={styles.filterContainer} style={{ backgroundColor: colors.primary }}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder={auth.role === 'ADMIN' ? "Search by student or project..." : "Search by project..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: colors.secondary }}
            />
          </div>
          <div className={styles.statusFilter}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderColor: colors.secondary }}
            >
              <option value="ALL">All Statuses</option>
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
                    style={{ 
                      backgroundColor: enrollment.status === 'APPROVED' ? '#e8f5e9' : 
                                      enrollment.status === 'REJECTED' ? '#ffebee' : 'white',
                      borderLeft: `4px solid ${
                        enrollment.status === 'APPROVED' ? colors.success :
                        enrollment.status === 'REJECTED' ? colors.danger :
                        colors.warning
                      }`
                    }}
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
  style={{ borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
>
  {selectedEnrollment ? (
    <div className={styles.modalContent}>
      <div className={styles.detailsGrid}>
        <div>
          <h3 style={{ color: colors.primary, marginBottom: '0.5rem' }}>Student Information</h3>
          <p><strong>Name:</strong> {selectedEnrollment.student?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {selectedEnrollment.student?.email || 'N/A'}</p>
          <p><strong>Skills:</strong> {selectedEnrollment.student?.skills?.join(', ') || 'N/A'}</p>
          <p><strong>Qualifications:</strong> {selectedEnrollment.student?.qualifications || 'N/A'}</p>
          <p><strong>Previous Work:</strong> {selectedEnrollment.student?.previousWork || 'N/A'}</p>
        </div>
        
        <div>
          <h3 style={{ color: colors.primary, marginBottom: '0.5rem' }}>Project Information</h3>
          <p><strong>Title:</strong> {selectedEnrollment.project?.title || 'N/A'}</p>
          <p><strong>Description:</strong> {selectedEnrollment.project?.description || 'N/A'}</p>
          <p><strong>Objective:</strong> {selectedEnrollment.project?.objective || 'N/A'}</p>
          <p><strong>Mentor:</strong> {selectedEnrollment.project?.mentor?.name || 'N/A'}</p>
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
            className={styles.toggleRecommendations}
            style={{ backgroundColor: colors.secondary, color: 'white', borderRadius: '8px' }}
          >
            {showRecommendations ? 'Hide Recommendations' : 'Show Recommended Students'}
          </button>
          
          {showRecommendations && (
            <div className={styles.recommendationList}>
              <h4 style={{ color: colors.primary }}>Recommended Students for this Project</h4>
              {recommendedStudents.length > 0 ? (
                <ul>
                  {recommendedStudents.map(student => (
                    <li key={student.userId}>
                      <strong>{student.name}</strong> - {student.skills?.join(', ')}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recommendations available for this project</p>
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
        title="Approve"
      >
        <FaCheckCircle className={styles.icon} />
        Approve
      </button>

      <button
        onClick={() => handleStatusUpdate('REJECTED')}
        className={`${styles.actionButton} ${styles.reject}`}
        title="Reject"
      >
        <FaTimesCircle className={styles.icon} />
        Reject
      </button>
    </>
  )}

  <button
    onClick={handleDelete}
    className={`${styles.actionButton} ${styles.delete}`}
    title="Delete Enrollment"
  >
    <FaTrashAlt className={styles.icon} />
    Delete
  </button>
</div>
    </div>
  ) : null}
</Modal>

      </div>
    </GeneralLayout>
  );
};

export default EnrollmentPage;