// src/states/authState.js
import { atom } from "recoil";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

export const authState = atom({
  key: "authState",
  default: {
    isAuthenticated: !!token,
    userId: userId || null,
    role: role || null,
  },
});
