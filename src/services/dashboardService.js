// src/services/dashboardService.js
import axios from 'axios';

// Use the environment variable if available, otherwise use a default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const dashboardService = {
    getProjects: async (role, userId) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');

          let endpoint = '/api/projects';
          const params = {};
          
          if (role === 'MENTOR') {
            params.mentorId = userId;
          }

          const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            params,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log("Projects API Response:", response.data);
          return response.data.response || [];  // Ensure correct data extraction
        } catch (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }
      },

 
 
  getTasks: async (projectId = null) => {
    try {
      let endpoint = '/api/tasks';
      if (projectId) {
        endpoint = `/api/tasks/project/${projectId}`;
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Tasks API Response:", response.data);
      return response.data.response || [];  // Correct extraction
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  getStudentEnrollments: async (studentId) => {
    try {
        console.log("Calling API: /api/project-enrollment with studentId:", studentId);
        
        const response = await axios.get(
            `${API_BASE_URL}/api/project-enrollment`, 
            {
                params: { 
                    studentId,
                    status: "APPROVED" // Hardcoded to only get approved projects
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Approved Projects API Response:", response.data);
        return response.data.response || []; // Returns list of approved projects
    } catch (error) {
        console.error('Error fetching approved projects:', error.response?.data || error.message);
        throw error;
    }
},


getTasksByProjectId: async (projectId) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
          params: { projectId },  // Send projectId as a query parameter
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
          }
      });

      console.log(`Tasks for project ${projectId}:`, response.data);
      return response.data.response || [];
  } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
  }
},


  getStudentTasks: async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stu-task`, {
        params: { studentId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Student Tasks API Response:", response.data);
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching student tasks:', error);
      throw error;
    }
  }
};

export default dashboardService;