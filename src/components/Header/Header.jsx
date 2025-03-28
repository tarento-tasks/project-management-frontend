import React, { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { FaSearch, FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { authState } from '../../states/authState';
import styles from "./header.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const roleDisplayNames = {
  ADMIN: "Administrator",
  MENTOR: "Mentor", 
  STUDENT: "Student"
};

const roleIcons = {
  ADMIN: <i className="bi bi-shield-lock me-2"></i>,
  MENTOR: <i className="bi bi-person-workspace me-2"></i>,
  STUDENT: <i className="bi bi-mortarboard me-2"></i> 
};

const Header = () => {
  // Get auth state from Recoil
  const auth = useRecoilValue(authState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize role and get display values
  const normalizedRole = auth.role?.toUpperCase() || "ADMIN";
  const displayName = auth.user?.name || "User";
  const displayRole = roleDisplayNames[normalizedRole] || auth.role;
  const roleIcon = roleIcons[normalizedRole] || <FaUserCircle size={16} className="me-2" />;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          <div 
            className={`${styles.userInfo} d-flex align-items-center ps-3 position-relative`}
            ref={dropdownRef}
          >
            <div 
              className="d-flex align-items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              {auth.user?.avatar ? (
                <img 
                  src={auth.user.avatar} 
                  alt="Profile" 
                  className={`${styles.profileImage} me-2`}
                />
              ) : (
                <FaUserCircle size={32} className="text-secondary me-2" />
              )}
              
              <div className="lh-1 me-2">
                <p className="mb-0 fw-medium small">{displayName}</p>
                <small className="text-muted d-flex align-items-center">
                  {roleIcon}
                  {displayRole}
                </small>
              </div>
              
              <FaChevronDown 
                size={14} 
                className={`text-muted ${isDropdownOpen ? styles.rotateUp : ''}`}
              />
            </div>
            
            {isDropdownOpen && (
              <div className={`${styles.dropdownMenu} shadow-sm`}>
                <div className={`${styles.dropdownItem} py-2 px-3`}>
                  <FaUserEdit className="me-2" />
                  <span>Edit Profile</span>
                </div>
                <div className={`${styles.dropdownDivider} my-1`}></div>
                <div className={`${styles.dropdownItem} py-2 px-3`}>
                  <FaSignOutAlt className="me-2" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;