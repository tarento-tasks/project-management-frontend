




import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import styles from "./dashboardLayout.module.css";

const DashboardLayout = ({ children, role = "admin" }) => {
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <Sidebar role={role} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;