import React from "react";
import styles from "./authLayout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authOverlay}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
