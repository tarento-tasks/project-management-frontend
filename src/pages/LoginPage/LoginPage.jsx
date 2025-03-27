
import React from "react";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import LoginForm from "../../components/LoginForm/LoginForm";

const LoginPage = () => {
  const handleLogin = (loginData) => {
    console.log("Login attempt with:", loginData);
  };

  return (
    <AuthLayout>
      <LoginForm onLogin={handleLogin} />
    </AuthLayout>
  );
};

export default LoginPage;