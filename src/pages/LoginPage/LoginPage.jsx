import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState } from "../../states/authState";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import LoginForm from "../../components/LoginForm/LoginForm";
import { login } from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState); // Update auth state globally

  const handleLogin = async (loginData) => {
    try {
      const response = await login(loginData);
      
      if (response && response.response.token) {
        const { token, role, name, email } = response.response;

        // Store token & user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify({ name, email, role }));

        // Update Recoil State
        setAuth({ isAuthenticated: true, role, name, email });

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        alert("Invalid login response. Please try again.");
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <AuthLayout>
      <LoginForm onLogin={handleLogin} />
    </AuthLayout>
  );
};

export default LoginPage;
