// src/pages/LoginPage/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState } from "../../states/authState";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import LoginForm from "../../components/LoginForm/LoginForm";
import { login } from "../../services/authService";
import styles from './loginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async ({ email, password }) => {
    try {
      setLoginError(null);

      const { token, userId, role, name } = await login({ email, password });

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify({ name, email, role }));

      // Update Recoil state
      setAuth({
        isAuthenticated: true,
        userId,
        role,
      });

      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <AuthLayout>
        <LoginForm onLogin={handleLogin} loginError={loginError} />
      </AuthLayout>
    </div>
  );
};

export default LoginPage;
