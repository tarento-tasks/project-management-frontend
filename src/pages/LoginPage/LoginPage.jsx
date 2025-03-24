import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './loginPage.module.css';

const LoginPage = () => {
  const handleLogin = (loginData) => {
    console.log('Login attempt with:', loginData);
  
  };

  return (
    <div className={styles.loginPage}>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;


