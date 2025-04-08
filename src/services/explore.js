import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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

  MySwal.fire({
    title: 'Error',
    text: error.response?.data?.message || error.message || 'Something went wrong',
    icon: 'error',
    confirmButtonColor: '#517ea6'
  });

  throw error;
};

const ExploreService = {
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
  
  getProjectSkills: async (projectId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/project-skills/project/${projectId}`,
        { headers: getAuthHeaders() }
      );
      return response.data.response;
    } catch (error) {
      console.error('Project skills fetch error:', error);
      return [];
    }
  },
  
  getRecommendedProjects: async (studentId) => {
    // Auto-fetch studentId from localStorage if not passed
    studentId = studentId || localStorage.getItem('userId');
  
    if (!studentId) {
      console.error("Cannot fetch recommendations: No student ID provided");
      return [];
    }
  
    try {
      console.log(`Fetching recommendations for student ID: ${studentId}`);
  
      const url = `${API_BASE_URL}/api/project-skills/recommendations/projects/${studentId}`;
      const headers = getAuthHeaders();
  
      const response = await axios.get(url, { headers });
      console.log("Recommendation API response:", response.data);
  
      if (!response.data.response) {
        console.warn("Recommendation API response missing 'response' field:", response.data);
        return [];
      }
  
      return response.data.response;
    } catch (error) {
      console.error('Recommendations error:', error);
      console.error('Error details:', error.response?.data || error.message);
      return [];
    }
  },
  

  enrollInProject: async (projectId, studentId) => {
    try {
      const enrollmentDto = {
        projectId,
        studentId,
        status: 'PENDING'
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/api/project-enrollment`,
        enrollmentDto,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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

  getEnrollmentsByStudent: async (studentId) => {
    if (!studentId) {
      console.error("Cannot fetch enrollments: No student ID provided");
      return [];
    }
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/project-enrollment`,
        {
          params: { studentId },
          headers: getAuthHeaders()
        }
      );
  
      // Debug log to see the actual response structure
      console.log('Enrollments API Response:', response.data);
  
      // Handle different response structures
      if (response.data?.response) {
        // If response is an array of enrollments with project objects
        if (Array.isArray(response.data.response)) {
          return response.data.response.map(enrollment => enrollment.project?.projectId || enrollment.projectId);
        }
        // If response is directly an array of project IDs
        return response.data.response;
      }
  
      console.warn("Unexpected response format:", response.data);
      return [];
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  }
}; 
export default ExploreService;