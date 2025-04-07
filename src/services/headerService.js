// src/services/userService.js

export const fetchCurrentUser = async () => {
    try {
      // Get user ID directly from localStorage
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!token || !userId) throw new Error("No authentication token or userId found");
      
      const response = await fetch(`http://localhost:8080/api/users?userId=${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };
  
  export const updateUserProfile = async (userData, image) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      const formData = new FormData();
      formData.append("userId", userData.userId);
      formData.append("email", userData.email);
      formData.append("name", userData.name);
      formData.append("dob", userData.dob);
      formData.append("roleId", userData.roleId);
  
      if (userData.previousWork) {
        formData.append("previousWork", userData.previousWork);
      }
  
      if (userData.qualifications) {
        formData.append("qualifications", userData.qualifications);
      }
  
      if (userData.password && userData.password.trim() !== "") {
        formData.append("password", userData.password); // 🔐 change password
      }
  
      if (image && image instanceof File) {
        formData.append("image", image);
      }
  
      const response = await fetch(`http://localhost:8080/api/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: formData
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };
  
  
  export const fetchAllSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      const response = await fetch(`http://localhost:8080/api/skills`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }
  };
  
  export const getUserSkills = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      const response = await fetch(`http://localhost:8080/api/skill-mapping?userId=${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user skills");
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching user skills:", error);
      throw error;
    }
  };
  
 
  export const addSkillToUser = async (userId, skillId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      const response = await fetch(`http://localhost:8080/api/skill-mapping/users/${userId}/skills/${skillId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
  
      if (!response.ok) {
        throw new Error("Failed to add skill to user");
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error adding skill to user:", error);
      throw error;
    }
  };