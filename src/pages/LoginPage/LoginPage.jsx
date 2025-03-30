import React from "react";
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

  const handleLogin = async ({ email, password, rememberMe }) => {
    try {
      const response = await login({ email, password });
      
      if (response?.token) {
        const { token, role, name, email: userEmail } = response;
        const user = { name, email: userEmail, role };
  
        // Store in storage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", token);
        storage.setItem("role", role);  // Store role separately
        storage.setItem("user", JSON.stringify(user));  // And in user object
  
        // Update Recoil state - must match authState structure
        setAuth({
          isAuthenticated: true,
          token,
          role,
          user
        });
  
        // Navigate - ensure role is lowercase in route
        navigate(`/${role.toLowerCase()}/dashboard`);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  return (
    <div className={styles.loginPage}>
      <AuthLayout>
        <LoginForm onLogin={handleLogin} />
      </AuthLayout>
    </div>
  );
};

export default LoginPage;