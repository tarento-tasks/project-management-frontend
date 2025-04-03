// src/services/authService.js


import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Your backend URL

export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    const { token, userId, role } = response.data;

    // Save in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);

    return response.data;
  } catch (error) {
    throw error.response ? error.response : new Error("Login request failed");
  }
};


export const logout = () => {
  // Clear all authentication-related data
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  
  return true;
};