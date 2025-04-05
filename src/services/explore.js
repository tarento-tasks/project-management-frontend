import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  
  if (error.response?.status === 401 || error.message.includes('expired')) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login?session=expired';
    return;
  }

  Swal.fire({
    title: 'Error',
    text: error.response?.data?.message || error.message || 'Something went wrong',
    icon: 'error',
    confirmButtonColor: '#517ea6'
  });

  throw error;
};

const ExploreService = {
  /**
   * Get all projects or a specific project by ID
   * @param {string} [projectId] - Optional project ID
   * @returns {Promise<Array>} List of projects or single project
   */
  getProjects: async (projectId = null) => {
    try {
      const params = projectId ? { id: projectId } : {};
      const response = await axios.get(`${API_BASE_URL}/api/projects`, {
        params,
        headers: getAuthHeaders()
      });
      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get skills required for a specific project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of skills
   */
  getProjectSkills: async (projectId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/project-skills/project/${projectId}`,
        { headers: getAuthHeaders() }
      );
      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get recommended projects for a student
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} List of recommended projects
   */
  getRecommendedProjects: async (studentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/project-skills/recommendations/projects/${studentId}`,
        { headers: getAuthHeaders() }
      );
      return response.data.response;
    } catch (error) {
      console.error('Recommendations error:', error);
      // Return empty array if recommendations fail
      return [];
    }
  },

  /**
   * Enroll a student in a project
   * @param {string} projectId - Project ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Enrollment response
   */
  enrollInProject: async (projectId, studentId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/project-enrollments`,
        { projectId, studentId },
        { headers: getAuthHeaders() }
      );
      
      Swal.fire({
        title: 'Success!',
        text: response.data?.message || 'Enrollment successful',
        icon: 'success',
        confirmButtonColor: '#517ea6'
      });
      
      return response.data;
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Enrollment failed',
        icon: 'error',
        confirmButtonColor: '#517ea6'
      });
      throw error;
    }
  },

  /**
   * Get all available skills (for filtering)
   * @returns {Promise<Array>} List of all skills
   */
  getAllSkills: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/skills`,
        { headers: getAuthHeaders() }
      );
      return response.data.response;
    } catch (error) {
      console.error('Skills fetch error:', error);
      return [];
    }
  },

  /**
   * Get projects that match specific filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Filtered projects
   */
  getFilteredProjects: async (filters = {}) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/projects/filter`,
        {
          params: filters,
          headers: getAuthHeaders()
        }
      );
      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  }
};

export default ExploreService;