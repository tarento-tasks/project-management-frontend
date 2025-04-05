// src/pages/EnrollmentPage/EnrollmentPage.jsx
import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import GeneralLayout from '../../layouts/GeneralLayout';
import { 
  getEnrollments, 
  updateEnrollmentStatus,
  deleteEnrollment
} from '../../services/enrollmentService';
import ButtonComponent from '../../components/Buttons/ButtonComponent';
import Modal from '../../components/Modal/Modal';
import styles from './enrollments.module.css';

const EnrollmentPage = () => {
  const auth = useRecoilValue(authState);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        let data;
        
        if (auth.role === 'ADMIN') {
          data = await getEnrollments();
        } else if (auth.role === 'STUDENT') {
          data = await getEnrollments(null, auth.userId);
        }
        
        setEnrollments(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      fetchEnrollments();
    }
  }, [auth]);

  const handleRowClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
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
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEnrollment(selectedEnrollment.enrollmentId);
      setEnrollments(prev => prev.filter(e => e.enrollmentId !== selectedEnrollment.enrollmentId));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error deleting enrollment:', err);
    }
  };

  if (loading) return <GeneralLayout>Loading...</GeneralLayout>;
  if (error) return <GeneralLayout>Error: {error}</GeneralLayout>;

  return (
    <GeneralLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {auth.role === 'ADMIN' ? 'Enrollment Requests' : 'My Enrollments'}
        </h1>
        
        <div className={styles.tableContainer}>
          <table className={styles.enrollmentTable}>
            <thead>
              <tr>
                {auth.role === 'ADMIN' ? (
                  <>
                    <th>Enrollment ID</th>
                    <th>Project Title</th>
                    <th>Project ID</th>
                    <th>Student Name</th>
                    <th>Status</th>
                  </>
                ) : (
                  <>
                    <th>Project Title</th>
                    <th>Mentor Name</th>
                    <th>Enrollment ID</th>
                    <th>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr 
                  key={enrollment.enrollmentId} 
                  onClick={() => handleRowClick(enrollment)}
                  className={styles.tableRow}
                >
                  {auth.role === 'ADMIN' ? (
                    <>
                      <td>{enrollment.enrollmentId}</td>
                      <td>{enrollment.project?.title}</td>
                      <td>{enrollment.project?.projectId}</td>
                      <td>{enrollment.student?.name}</td>
                      <td>
                        <span className={`${styles.status} ${styles[enrollment.status.toLowerCase()]}`}>
                          {enrollment.status}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{enrollment.project?.title}</td>
                      <td>{enrollment.project?.mentor?.name || 'N/A'}</td>
                      <td>{enrollment.enrollmentId}</td>
                      <td>
                        <span className={`${styles.status} ${styles[enrollment.status.toLowerCase()]}`}>
                          {enrollment.status}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedEnrollment && (
            <div className={styles.modalContent}>
              <h2>Enrollment Details</h2>
              
              <div className={styles.detailsGrid}>
                <div>
                  <h3>Student Information</h3>
                  <p><strong>Name:</strong> {selectedEnrollment.student?.name}</p>
                  <p><strong>Email:</strong> {selectedEnrollment.student?.email}</p>
                  <p><strong>Skills:</strong> {selectedEnrollment.student?.skills || 'N/A'}</p>
                  <p><strong>Qualifications:</strong> {selectedEnrollment.student?.qualifications || 'N/A'}</p>
                  <p><strong>Previous Work:</strong> {selectedEnrollment.student?.previousWork || 'N/A'}</p>
                </div>
                
                <div>
                  <h3>Project Information</h3>
                  <p><strong>Title:</strong> {selectedEnrollment.project?.title}</p>
                  <p><strong>Description:</strong> {selectedEnrollment.project?.description}</p>
                  <p><strong>Mentor:</strong> {selectedEnrollment.project?.mentor?.name || 'N/A'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`${styles.status} ${styles[selectedEnrollment.status.toLowerCase()]}`}>
                      {selectedEnrollment.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                {auth.role === 'ADMIN' && selectedEnrollment.status === 'PENDING' && (
                  <>
                    <ButtonComponent 
                      label="Accept"
                      onClick={() => handleStatusUpdate('APPROVED')}
                      className={styles.acceptButton}
                    />
                    <ButtonComponent 
                      label="Reject"
                      onClick={() => handleStatusUpdate('REJECTED')}
                      className={styles.rejectButton}
                    />
                  </>
                )}
                <ButtonComponent 
                  label="Delete Enrollment"
                  onClick={handleDelete}
                  className={styles.deleteButton}
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </GeneralLayout>
  );
};

export default EnrollmentPage;