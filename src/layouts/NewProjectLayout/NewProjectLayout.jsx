
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import styles from './newProjectLayout.module.css';

const NewProjectLayout = ({ children, role = 'admin', userName = 'Admin', userRole = 'Administrator' }) => {
  return (
    <div className={styles.layoutContainer}>
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

export default NewProjectLayout;