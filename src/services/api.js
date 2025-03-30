
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ProjectService = {
  getAllProjects: () => api.get('/projects'),
  getRecommendedProjects: (studentId) => api.get(`/recommendations/projects/${studentId}`),
  enrollInProject: (projectId, studentId) => api.post(`/projects/${projectId}/enroll`, { studentId })
};


export default api;