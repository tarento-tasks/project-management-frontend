import React from 'react';
import styles from './AuthLayout.module.css';
import logo from '/src/assets/logopms.png'; 


const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="ProjectHive Logo" className={styles.logo} />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;