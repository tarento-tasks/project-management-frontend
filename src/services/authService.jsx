// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response : new Error("Login request failed");
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  return true;
};
