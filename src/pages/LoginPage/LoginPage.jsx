import React from 'react';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './loginPage.module.css';

const LoginPage = () => {
  const handleLogin = async (data) => {
    console.log('Login Data:', data);
   
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <AuthLayout>
      <div className={styles.loginPage}>
        <h1 className={styles.title}>Welcome to ProjectHive</h1>
        <p className={styles.subtitle}>Manage your projects efficiently</p>
        <LoginForm onLogin={handleLogin} />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;