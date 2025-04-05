

import { atom } from "recoil";

// Load authentication state from localStorage
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

export const authState = atom({
  key: "authState",
  default: {
    isAuthenticated: !!token, // true if token exists
    userId: userId || null,
    role: role || null,
  },
});
