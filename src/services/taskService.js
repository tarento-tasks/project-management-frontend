import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };
  
// Get logged-in user's details
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.response; 
};

// Fetch projects where the logged-in user is the mentor
export const getMentorProjects = async (mentorId) => {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data.response.filter(project => project.mentorId === mentorId);
};

// Fetch students enrolled in a specific project
export const getProjectStudents = async (projectId) => {
  const response = await axios.get(`${API_BASE_URL}/project-enrollment`);
  return response.data.response
    .filter(enrollment => enrollment.project.projectId === projectId)
    .map(enrollment => ({
      studentId: enrollment.student.userId,
      name: enrollment.student.name
    }));
};

// Create a new task
export const createTask = async (taskData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
