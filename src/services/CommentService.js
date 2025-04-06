import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';


const getAuthHeader = () => {
    const token = localStorage.getItem("token"); // adjust if using Recoil or cookies
    return { Authorization: `Bearer ${token}` };
  };
  
  export const getComments = async (taskId) => {
    const response = await axios.get(`${BASE_URL}/${taskId}/comments`, {
      headers: getAuthHeader()
    });
    return response.data;
  };
  
  export const addComment = async (taskId, userId, comment) => {
    const response = await axios.post(
      `${BASE_URL}/${taskId}/comments`,
      { userId, comment },
      { headers: getAuthHeader() }
    );
    return response.data;
  };
  
