import React from "react";
import { useRecoilValue } from 'recoil';
import { authState } from '../states/authState';
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import styles from "./generalLayout.module.css";

const GeneralLayout = ({ children }) => {
  // Get the current auth state including role
  const auth = useRecoilValue(authState);

  
  const role = auth.role  

  return (
    <div className={styles.dashboardContainer}>
      <Header role={role} user={auth.user} /> {/* Pass both role and user info */}
      <Sidebar role={role} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default GeneralLayout;