import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const getEnrollments = async (enrollmentId = null, studentId = null) => {
  const params = {};
  if (enrollmentId) params.enrollmentId = enrollmentId;
  if (studentId) params.studentId = studentId;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_BASE_URL}/api/project-enrollment`, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response || [];
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const getRecommendedStudents = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_BASE_URL}/api/project-skills/recommendations/students/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response || [];
  } catch (error) {
    console.error('Error fetching recommended students:', error);
    throw error;
  }
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.post(
      `${API_BASE_URL}/api/project-enrollment`, 
      { status }, 
      {
        params: { enrollmentId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
};

export const deleteEnrollment = async (enrollmentId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    await axios.delete(`${API_BASE_URL}/api/project-enrollment/${enrollmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    throw error;
  }
};