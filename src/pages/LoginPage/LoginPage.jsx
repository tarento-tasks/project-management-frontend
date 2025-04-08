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
      setLoginError(null); // clear previous error

      const response = await login({ email, password });

      if (response?.token) {
        const { token, role, name, email: userEmail } = response;
        const user = { name, email: userEmail, role };

        // Store in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(user));

        // Update Recoil state
        setAuth({
          isAuthenticated: true,
          token,
          role,
          user
        });

        navigate(`/${role.toLowerCase()}/dashboard`);
      }
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
