import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import styles from "./header.module.css";
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Header = ({ userName = "Admin", userRole = "Administrator" }) => {
  return (
    <header className={styles.headerContainer}>
      <div className={`${styles.headerContent} container-fluid`}>
        <div className={`${styles.searchContainer} d-flex align-items-center`}>
          <div className={styles.searchGroup}>
            <input 
              type="text" 
              className={`${styles.searchInput} form-control`} 
              placeholder="Search for anything..." 
            />
            <button className={`${styles.searchButton} btn`}>
              <FaSearch />
            </button>
          </div>
          <div className={`${styles.userInfo} d-flex align-items-center ps-3`}>
            <div className="d-flex align-items-center">
              <FaUserCircle size={24} className="text-secondary me-2" />
              <div className="lh-1">
                <p className="mb-0 fw-medium small">{userName}</p>
                <small className="text-muted">{userRole}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;