import React from "react";
import DashboardLayout from "../DashboardLayout"; // Relative path to DashboardLayout
import styles from "./newProjectLayout.module.css";

const NewProjectLayout = ({ children, role = "admin" }) => {
  return (
    <DashboardLayout role={role}>
      <div className={styles.formContent}>
        {children}
      </div>
    </DashboardLayout>
  );
};

export default NewProjectLayout;


