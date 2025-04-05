// src/services/enrollmentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/project-enrollment';

export const getEnrollments = async (enrollmentId = null, studentId = null) => {
  const params = {};
  if (enrollmentId) params.enrollmentId = enrollmentId;
  if (studentId) params.studentId = studentId;
  
  try {
    const response = await axios.get(API_BASE_URL, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  try {
    const response = await axios.post(API_BASE_URL, { status }, {
      params: { enrollmentId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
};

export const deleteEnrollment = async (enrollmentId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${enrollmentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    throw error;
  }
};