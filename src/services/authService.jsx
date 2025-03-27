// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Your backend URL

export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data; // Response should contain token, user info, and role
  } catch (error) {
    throw error.response ? error.response : new Error('Login request failed');
  }
};


export const logout = () => {
  localStorage.removeItem('token');
  return true;
};