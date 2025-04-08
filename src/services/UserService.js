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

const getFormDataHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
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

const UserService = {
  // Get all roles
  getRoles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/roles`, {
        headers: getAuthHeaders()
      });
      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  },

  // User-related methods
  getUsers: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        params,
        headers: getAuthHeaders()
      });
      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        params: { userId },
        headers: getAuthHeaders()
      });
      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  },

  

  saveUser: async (userData) => {
    try {
      const formData = new FormData();
      
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/api/users`, formData, {
        headers: getFormDataHeaders()
      });

      Swal.fire({
        title: 'Success!',
        text: 'User saved successfully',
        icon: 'success',
        confirmButtonColor: '#517ea6'
      });

      return response.data.response;
    } catch (error) {
      return handleError(error);
    }
  },

  
  deleteUser: async (userId) => {
    try {
      // Validate userId before making the request
      if (!userId) {
        throw new Error('User ID is required');
      }
  
      const response = await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
        headers: getAuthHeaders(),
        validateStatus: function (status) {
          return status < 500; // Reject only if status is greater than or equal to 500
        }
      });
  
      if (response.status === 200) {
        return {
          statusCode: 200,
          message: response.data?.message || 'User deleted successfully'
        };
      }
  
      if (response.status === 404) {
        return {
          statusCode: 404,
          message: response.data?.message || 'User not found'
        };
      }
  
      throw new Error(response.data?.message || 'Failed to delete user');
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  }
};

export default UserService;