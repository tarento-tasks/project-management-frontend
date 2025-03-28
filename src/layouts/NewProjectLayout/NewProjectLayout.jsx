import React from "react";
import GeneralLayout from "../GeneralLayout"; // Relative path to DashboardLayout
import styles from "./newProjectLayout.module.css";

const NewProjectLayout = ({ children, role = "admin" }) => {
  return (
    <GeneralLayout role={role}>
      <div className={styles.formContent}>
        {children}
      </div>
    </GeneralLayout>
  );
};

export default NewProjectLayout;


