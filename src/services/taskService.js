// src/services/taskService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get logged-in user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      throw new Error('Token or userId not found in localStorage');
    }

    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId }
    });

    return response.data.response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch projects assigned to mentor
export const getMentorProjects = async (mentorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders(),
      params: { mentorId }
    });
    return response.data.response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Create new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: getAuthHeaders()
    });
    return response.data.response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Get approved students for a project
export const getProjectStudents = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project-enrollment/approved-students`, {
      headers: getAuthHeaders(),
      params: { projectId }
    });
    return response.data.response.map(student => ({
      studentId: student.userId,
      name: student.name
    }));
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Assign student to task using the /api/stu-task endpoint
export const assignStudentToTask = async (taskId, studentId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stu-task`, 
      {
        taskId,
        studentId
      },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data.response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};