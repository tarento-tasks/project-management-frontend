import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import Modal from "../Modal/Modal";
import FormComponent from "../Forms/FormComponent";
import styles from "./header.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ userName = "Admin", userRole = "Administrator", profileImage = null }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  // Edit Profile form fields
  const editProfileFields = [
    { 
      name: "profileImage", 
      label: "Profile Image", 
      type: "file", 
      accept: "image/*"
    },
    { 
      name: "name", 
      label: "Name", 
      type: "text", 
      placeholder: "Enter your name",
      required: true,
      validation: {
        minLength: 2,
        message: "Name must be at least 2 characters"
      }
    },
    { 
      name: "email", 
      label: "Email", 
      type: "email", 
      placeholder: "Enter your email",
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email"
      }
    },
    { 
      name: "password", 
      label: "Password", 
      type: "password", 
      placeholder: "Enter new password",
      validation: {
        minLength: 8,
        message: "Password must be at least 8 characters"
      }
    },
    { 
      name: "dob", 
      label: "Date of Birth", 
      type: "date",
      required: true
    },
    { 
      name: "qualifications", 
      label: "Qualifications", 
      type: "textarea", 
      placeholder: "Enter your qualifications",
      rows: 3
    },
    { 
      name: "skills", 
      label: "Skills", 
      type: "select", 
      options: ["React", "Node.js", "Python", "Java", "UI/UX", "Project Management"],
      multiple: true
    },
    { 
      name: "previousWorks", 
      label: "Previous Works", 
      type: "textarea", 
      placeholder: "Describe your previous works/experience",
      rows: 4
    }
  ];

  const handleEditProfileSubmit = (formData) => {
    console.log("Profile updated:", formData);
    setShowEditProfileModal(false);
    // Add your profile update logic here
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfileClick = () => {
    setIsDropdownOpen(false);
    setShowEditProfileModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
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
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className={`${styles.profileImage} me-2`}
                  />
                ) : (
                  <FaUserCircle size={32} className="text-secondary me-2" />
                )}
                
                <div className="lh-1 me-2">
                  <p className="mb-0 fw-medium small">{userName}</p>
                  <small className="text-muted">{userRole}</small>
                </div>
                
                <FaChevronDown 
                  size={14} 
                  className={`text-muted ${isDropdownOpen ? styles.rotateUp : ''}`}
                />
              </div>
              
              {isDropdownOpen && (
                <div className={`${styles.dropdownMenu} shadow-sm`}>
                  <div 
                    className={`${styles.dropdownItem} py-2 px-3`}
                    onClick={handleEditProfileClick}
                  >
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

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        title="Edit Profile"
      >
        <div className={styles.profileImageContainer}>
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className={styles.profileImagePreview}
            />
          ) : (
            <FaUserCircle size={100} className={styles.profileImagePlaceholder} />
          )}
        </div>
        <FormComponent 
          fields={editProfileFields} 
          onSubmit={handleEditProfileSubmit}
          validateOnBlur={true}
        />
      </Modal>
    </>
  );
};

export default Header;