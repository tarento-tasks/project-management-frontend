

import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ children, role = 'admin', userName = 'Admin', userRole = 'Administrator' }) => {
  return (
    <div className={styles.appContainer}>
      <Sidebar role={role} />
      <div className={styles.mainContent}>
        <Header userName={userName} userRole={userRole} />
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;