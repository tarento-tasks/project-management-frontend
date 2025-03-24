// components/Header/Header.jsx
import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import styles from "./header.module.css";

const Header = ({ userName = "Alex Meian", userRole = "Product Manager" }) => {
  return (
    <div className={`d-flex justify-content-between align-items-center ${styles.headerContainer}`}>
      <h2 className="fw-bold">Dashboard</h2>
      <div className="d-flex align-items-center">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Search for anything..." />
          <button className="btn btn-outline-secondary">
            <FaSearch />
          </button>
        </div>
        <div className="ms-3 d-flex align-items-center">
  <FaUserCircle size={30} className="me-2" />
  <div className={styles.userInfo}>
    <p className="m-0 fw-bold">{userName}</p>
    <small className="text-muted">{userRole}</small>
  </div>
</div>

      </div>
    </div>
  );
};

export default Header;
