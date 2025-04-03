import React from 'react';
import styles from './authLayout.module.css';
import illustration from '../../../src/assets/illustration.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.imageOverlay}></div>
        <img 
          src={illustration} 
          alt="Workplace Illustration" 
          className={styles.authImage}
        />
        
      </div>
      <div className={styles.formSection}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;