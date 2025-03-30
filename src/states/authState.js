import { atom } from 'recoil';

// Helper to safely parse localStorage
const getStoredAuth = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  let role, user;

  try {
    role = localStorage.getItem('role') || sessionStorage.getItem('role');
    const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error("Failed to parse auth data", e);
  }

  return {
    isAuthenticated: !!token,
    token: token || null,
    role: role || (user ? user.role : null),
    user: user || null
  };
};

export const authState = atom({
  key: 'authState',
  default: getStoredAuth()
});