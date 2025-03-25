import React from "react";
import styles from "./logoDisplay.module.css";
import logo from "/src/assets/logopms1.png";


const LogoDisplay = () => {
  return (
    <div className={styles.logoContainer}>
      <img src={logo} alt="Project Management System Logo" className={styles.logo} />
    </div>
  );
};

export default LogoDisplay;