import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const getEnrollments = async (enrollmentId = null, studentId = null) => {
  const params = {};
  if (enrollmentId) params.enrollmentId = enrollmentId;
  if (studentId) params.studentId = studentId;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_BASE_URL}/api/project-enrollment`, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response || [];
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

// Fetch all skills
export const getAllSkills = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_BASE_URL}/api/skills`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// Fetch skills for a specific user
export const getUserSkills = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_BASE_URL}/api/skill-mapping`, {
      params: { userId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response || [];
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
};
export const getStudentSkills = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    // 1. First fetch skill mappings for the user
    const mappingResponse = await axios.get(`${API_BASE_URL}/api/skill-mapping`, {
      params: { userId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 2. Extract skill IDs from the response
    const skillMappings = mappingResponse.data?.response || [];
    const skillIds = skillMappings.map(mapping => mapping.skillId);

    if (skillIds.length === 0) return [];

    // 3. Fetch all skills to map IDs to names
    const skillsResponse = await axios.get(`${API_BASE_URL}/api/skills`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const allSkills = skillsResponse.data?.response || [];
    
    // 4. Map skill IDs to skill names
    return skillIds.map(skillId => {
      const skill = allSkills.find(s => s.skillId === skillId);
      return skill?.skillName;
    }).filter(Boolean); // Remove any undefined values
    
  } catch (error) {
    console.error('Error fetching student skills:', error);
    // Return empty array instead of throwing error to prevent UI breakage
    return [];
  }
};


export const getRecommendedStudents = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_BASE_URL}/api/project-skills/recommendations/students/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response || [];
  } catch (error) {
    console.error('Error fetching recommended students:', error);
    throw error;
  }
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.post(
      `${API_BASE_URL}/api/project-enrollment`, 
      { status }, 
      {
        params: { enrollmentId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
};

export const deleteEnrollment = async (enrollmentId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    await axios.delete(`${API_BASE_URL}/api/project-enrollment/${enrollmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    throw error;
  }
};