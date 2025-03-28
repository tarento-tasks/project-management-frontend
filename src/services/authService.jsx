
// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; 

export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    const token = response.data?.response?.token;
    
    if (response.data && response.data.response.token) {
      localStorage.setItem('token', response.data.response.token); // Store token in localStorage
    }

    return response.data; 
  } catch (error) {
    throw error.response ? error.response : new Error('Login request failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token'); // Remove token on logout
  return true;
};
