import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserEdit, FaTimes, FaPlus } from "react-icons/fa";
import FormComponent from "../Forms/FormComponent";
import styles from "./header.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ 
  userName = "Admin", 
  userRole = "Administrator", 
  profileImage = null,
  onSearch,
  onLogout
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(profileImage);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const editProfileFields = [
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
    }
  ];

  const handleEditProfileSubmit = (formData) => {
    console.log("Profile updated:", { ...formData, profileImage: selectedImage });
    setShowEditProfileModal(false);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfileClick = () => {
    setIsDropdownOpen(false);
    setShowEditProfileModal(true);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
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
            <form 
              className={styles.searchGroup}
              onSubmit={handleSearchSubmit}
            >
              <input 
                type="text" 
                className={`${styles.searchInput} form-control`} 
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
              />
              <button 
                type="submit" 
                className={`${styles.searchButton} btn`}
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
            </form>
            
            <div 
              className={`${styles.userInfo} d-flex align-items-center ps-3 position-relative`}
              ref={dropdownRef}
            >
              <div 
                className="d-flex align-items-center cursor-pointer"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
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
                  <div 
                    className={`${styles.dropdownItem} py-2 px-3`}
                    onClick={handleLogoutClick}
                  >
                    <FaSignOutAlt className="me-2" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showEditProfileModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <h3>Edit Profile</h3>
        <button 
          onClick={() => setShowEditProfileModal(false)}
          className={styles.closeButton}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className={styles.modalContent}>
        <div className={styles.imageUploadContainer}>
          <div 
            className={styles.profileImageWrapper}
            onClick={handleImageClick}
            aria-label="Change profile picture"
          >
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Profile" 
                className={styles.profileImageLarge}
              />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <FaPlus className={styles.plusIcon} />
                <span>Add Photo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className={styles.hiddenFileInput}
          />
        </div>
        
        <div className={styles.formWrapper}>
          <FormComponent 
            fields={editProfileFields}
            onSubmit={handleEditProfileSubmit}
            validateOnBlur={true}
            submitButtonText="Save Changes"
            cancelButtonText="Cancel"
            onCancel={() => setShowEditProfileModal(false)}
          />
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Header;