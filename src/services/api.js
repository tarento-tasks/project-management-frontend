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
  },

  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      throw error;
    }
  },
  mapSkillToProject: async (mappingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/project-skills`, mappingData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error mapping skill to project:", error.response?.data || error.message);
      throw error;
    }
  },

  getProjectEnrollments: async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login first');
        }

        // Verify token hasn't expired
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            throw new Error('Session expired');
        }

        const response = await axios.get(`${API_BASE_URL}/project-enrollment`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            validateStatus: (status) => status < 500 // Don't reject for 403
        });

        if (response.status === 403) {
            // Check if it's a role issue
            if (tokenData.authorities?.includes('ROLE_MENTOR')) {
                throw new Error('Mentors need special permission for this resource');
            }
            throw new Error('Access denied - insufficient permissions');
        }

        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        
        // Handle token expiration or invalid token
        if (error.message.includes('expired') || 
            error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login?session=expired';
            return;
        }

        // Handle 403 specifically
        if (error.response?.status === 403) {
            Swal.fire({
                title: 'Permission Required',
                text: 'Your MENTOR role needs additional permissions to access this resource',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        throw error;
    }
},

  getProjects: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error.response?.data || error.message);
      throw error;
    }
  }
};


export default API;