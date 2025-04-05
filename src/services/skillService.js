
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getAllSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}/skills`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const getUserSkills = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/skill-mapping?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
};

export const addSkillToUser = async (userId, skillId) => {
  try {
    const response = await axios.post(
      `${API_URL}/skill-mapping/users/${userId}/skills/${skillId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data.response;
  } catch (error) {
    console.error('Error adding skill to user:', error);
    throw error;
  }
};

export const removeSkillFromUser = async (userId, skillId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/skill-mapping/users/${userId}/skills/${skillId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data.response;
  } catch (error) {
    console.error('Error removing skill from user:', error);
    throw error;
  }
};