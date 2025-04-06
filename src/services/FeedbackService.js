import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';

// Utility to attach the token to request headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Update this if you’re using cookies or Recoil
  return { Authorization: `Bearer ${token}` };
};

// Named export for getFeedback
export const getFeedback = async (taskId) => {
  const response = await axios.get(`${BASE_URL}/${taskId}/feedback`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Named export for addFeedback
export const addFeedback = async (taskId, mentorId, feedback) => {
  const response = await axios.post(
    `${BASE_URL}/${taskId}/feedback`,
    { mentorId, feedback },
    { headers: getAuthHeader() }
  );
  return response.data;
};
