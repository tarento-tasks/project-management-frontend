import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Update if needed

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const API = {
  createProject: async (projectData) => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error.message);
      throw error;
    }
  },

  getAllSkills: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/skills`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching skills:", error.response?.data || error.message);
      throw error;
    }
  },

  getMentors: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users?role=MENTOR`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching mentors:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default API;
