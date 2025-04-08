import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserEdit, FaTimes, FaPlus } from "react-icons/fa";
import { logout } from "../../services/authService";
import { fetchCurrentUser, updateUserProfile, fetchAllSkills, getUserSkills, addSkillToUser } from "../../services/headerService";

import defaultProfileImage from "../../assets/default-dp.jpeg";
import { FaKey } from "react-icons/fa";
import styles from "./header.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [skillsToAdd, setSkillsToAdd] = useState([]);
  const [tempSelectedSkill, setTempSelectedSkill] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    previousWork: "",
    qualifications: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
const [showErrorModal, setShowErrorModal] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [passwordErrors, setPasswordErrors] = useState({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: ""
});
const colors = {
  primary: "#517ea6",
  primary600: "#3e648b",
  primary700: "#335171",
  primary800: "#2d455f",
  primary900: "#2a3c50",
  primary950: "#212e3f"
};
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
const [passwordForm, setPasswordForm] = useState({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: ""
});
  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const user = await fetchCurrentUser();
        setUserData(user);
        
     
        setFormData({
          name: user.name || "",
          email: user.email || "",
          dob: user.dob || "",
          password: "",
          previousWork: user.previousWork || "",
          qualifications: user.qualifications || ""
        });

    
        if (user.imageBase64) {
          setSelectedImage(`data:image/jpeg;base64,${user.imageBase64}`);
        }

       
        if (user.userId) {
          const skills = await getUserSkills(user.userId);
          setUserSkills(skills || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  // Fetch all available skills for dropdown when modal opens
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await fetchAllSkills();
        setAllSkills(skills || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    if (showEditProfileModal) {
      fetchSkills();
    }
  }, [showEditProfileModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddSkill = () => {
    if (tempSelectedSkill && !skillsToAdd.includes(tempSelectedSkill)) {
      setSkillsToAdd([...skillsToAdd, tempSelectedSkill]);
      setTempSelectedSkill("");
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSkillsToAdd(skillsToAdd.filter(id => id !== skillId));
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userData) return;
      
      const updatedData = {
        ...userData,
        ...formData
      };
      
      await updateUserProfile(updatedData, imageFile);
      
      if (skillsToAdd.length > 0) {
        await Promise.all(
          skillsToAdd.map(skillId => 
            addSkillToUser(userData.userId, skillId)
          )
        );
      }
      
      // Refresh user data
      const user = await fetchCurrentUser();
      setUserData(user);
      
      if (user.imageBase64) {
        setSelectedImage(`data:image/jpeg;base64,${user.imageBase64}`);
      }
      
      // Refresh user skills
      const skills = await getUserSkills(user.userId);
      setUserSkills(skills || []);
      setSkillsToAdd([]);
      setShowEditProfileModal(false);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setShowErrorModal(true);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();
  
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setPasswordErrors({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    });
  
    // Validate inputs
    let isValid = true;
    const newErrors = { ...passwordErrors };
  
    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }
  
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }
  
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords don't match";
      isValid = false;
    }
  
    if (!isValid) {
      setPasswordErrors(newErrors);
      return;
    }
  
    try {
      if (!userData) {
        throw new Error("User data not available");
      }
  
      const updateData = {
        ...userData,
        oldPassword: passwordForm.oldPassword,
        password: passwordForm.newPassword
      };
  
      await updateUserProfile(updateData, null);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Close password change modal and reset form
      setShowChangePasswordModal(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (err) {
      console.error("Failed to update password:", err);
      setErrorMessage(err.response?.data?.message || "Failed to update password. Please check your current password.");
      setShowErrorModal(true);
    }
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  
  const handleEditProfileClick = () => {
    setIsDropdownOpen(false);
    setShowEditProfileModal(true);
  };

  const handleLogoutClick = async () => {
    setIsDropdownOpen(false);
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
  
      if (!response.ok) throw new Error("Logout request failed");
      
      logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSkillChange = (e) => {
    setSelectedSkill(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get profile image with fallback
  const profileImage = selectedImage || defaultProfileImage;

  if (isLoading) {
    return (
      <header className={styles.headerContainer}>
        <div className={`${styles.headerContent} container-fluid`}>
          <div className="d-flex justify-content-end">
            <div className={`${styles.userInfo} d-flex align-items-center ps-3`}>
              <div className="d-flex align-items-center">
                <FaUserCircle size={32} className="text-secondary me-2" />
                <div className="lh-1 me-2">
                  <p className="mb-0 fw-medium small">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={`${styles.headerContent} container-fluid`}>
          <div className="d-flex justify-content-end">
            <div className={`${styles.userInfo} d-flex align-items-center ps-3 position-relative`} ref={dropdownRef}>
              <div className="d-flex align-items-center cursor-pointer" onClick={toggleDropdown} aria-expanded={isDropdownOpen} aria-haspopup="true">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className={`${styles.profileImage} me-2`} 
                  onError={(e) => { e.target.src = defaultProfileImage }} 
                />

                <div className="lh-1 me-2">
                  <p className="mb-0 fw-medium small">{userData?.name || "User"}</p>
                </div>

                <FaChevronDown size={14} className={`text-muted ${isDropdownOpen ? styles.rotateUp : ''}`} />
              </div>

              {isDropdownOpen && (
  <div className={`${styles.dropdownMenu} shadow-sm`}>
    <div className={`${styles.dropdownItem} py-2 px-3`} onClick={handleEditProfileClick}>
      <FaUserEdit className="me-2" />
      <span>Edit Profile</span>
    </div>
    <div className={`${styles.dropdownItem} py-2 px-3`} onClick={() => {
      setIsDropdownOpen(false);
      setShowChangePasswordModal(true);
    }}>
      <FaKey className="me-2" />
      <span>Change Password</span>
    </div>
    <div className={`${styles.dropdownDivider} my-1`}></div>
    <div className={`${styles.dropdownItem} py-2 px-3`} onClick={handleLogoutClick}>
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
      {showEditProfileModal && userData && (
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

            <form onSubmit={handleSubmit} className={styles.modalContent}>
              <div className={styles.imageUploadContainer}>
                <div className={styles.profileImageWrapper} onClick={handleImageClick} aria-label="Change profile picture">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className={styles.profileImageLarge} 
                    onError={(e) => { e.target.src = defaultProfileImage }}
                  />
                  <div className={styles.imageOverlay}>
                    <FaPlus className={styles.plusIcon} />
                    <span>Change Photo</span>
                  </div>
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
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="dob" className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    className="form-control"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                
                <div className="mb-3">
                  <label htmlFor="previousWork" className="form-label">Previous Work</label>
                  <input
                    type="text"
                    id="previousWork"
                    name="previousWork"
                    className="form-control"
                    value={formData.previousWork}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="qualifications" className="form-label">Qualifications</label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    className="form-control"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                  />
                </div>
                 {/* Updated Skills Section */}
                 <div className="mb-3">
                  <label htmlFor="skillSelect" className="form-label">Add Skills</label>
                  <div className="d-flex align-items-center mb-2">
                    <select
                      id="skillSelect"
                      className="form-select me-2"
                      value={tempSelectedSkill}
                      onChange={(e) => setTempSelectedSkill(e.target.value)}
                    >
                      <option value="">Select a skill</option>
                      {allSkills
                        .filter(skill => ![...userSkills.map(s => s.skillId), ...skillsToAdd].includes(skill.skillId))
                        .map(skill => (
                          <option key={skill.skillId} value={skill.skillId}>
                            {skill.skillName}
                          </option>
                        ))}
                    </select>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleAddSkill}
                      disabled={!tempSelectedSkill}
                    >
                      Add
                    </button>
                  </div>
                  
                  {skillsToAdd.length > 0 && (
                    <div className="mb-3">
                      <h6>Skills to be added:</h6>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {skillsToAdd.map(skillId => {
                          const skill = allSkills.find(s => s.skillId === skillId);
                          return (
                            <span key={skillId} className="badge bg-primary">
                              {skill?.skillName}
                              <button 
                                type="button" 
                                className="ms-2 btn-close btn-close-white"
                                onClick={() => handleRemoveSkill(skillId)}
                                aria-label="Remove skill"
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {userSkills.length > 0 && (
                    <div className="mb-3">
                      <h6>Current Skills:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {userSkills.map((skill, index) => (
                          <span key={index} className="badge bg-secondary">
                            {skill.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={() => setShowEditProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                
               
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {showChangePasswordModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContainer} style={{ 
      maxWidth: "350px",
      borderRadius: "8px",
      overflow: "hidden"
    }}>
      <div style={{ 
        backgroundColor: colors.primary700,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ 
          color: "white",
          margin: 0,
          fontSize: "1rem",
          fontWeight: 600
        }}>Change Password</h3>
        <button 
          onClick={() => setShowChangePasswordModal(false)} 
          style={{ 
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
      </div>
      <div style={{ 
        padding: "20px",
        backgroundColor: "white"
      }}>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label htmlFor="oldPassword" className="form-label">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              className={`form-control ${passwordErrors.oldPassword ? "is-invalid" : ""}`}
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordErrors.oldPassword && (
              <div className="invalid-feedback">{passwordErrors.oldPassword}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={`form-control ${passwordErrors.newPassword ? "is-invalid" : ""}`}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
            {passwordErrors.newPassword && (
              <div className="invalid-feedback">{passwordErrors.newPassword}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className={`form-control ${passwordErrors.confirmNewPassword ? "is-invalid" : ""}`}
              value={passwordForm.confirmNewPassword}
              onChange={(e) => {
                handlePasswordChange(e);
                // Validate password match on change
                if (e.target.value !== passwordForm.newPassword) {
                  setPasswordErrors(prev => ({
                    ...prev,
                    confirmNewPassword: "Passwords don't match"
                  }));
                } else {
                  setPasswordErrors(prev => ({
                    ...prev,
                    confirmNewPassword: ""
                  }));
                }
              }}
              required
              minLength="6"
            />
            {passwordErrors.confirmNewPassword && (
              <div className="invalid-feedback">{passwordErrors.confirmNewPassword}</div>
            )}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              style={{
                backgroundColor: "transparent",
                color: colors.primary700,
                border: `1px solid ${colors.primary700}`,
                padding: "8px 16px",
                marginRight: "10px"
              }}
              onClick={() => setShowChangePasswordModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: colors.primary,
                color: "white",
                border: "none",
                padding: "8px 16px"
              }}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
 {/* Success Modal */}
 {/* Success Modal - Reduced size with theme */}
 {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer} style={{ 
            maxWidth: "350px",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <div className={styles.modalHeader} style={{ 
              backgroundColor: colors.primary700,
              padding: "15px 20px"
            }}>
              <h3 style={{ 
                color: "white",
                margin: 0,
                fontSize: "1.2rem"
              }}>Success</h3>
              <button 
                onClick={() => setShowSuccessModal(false)} 
                className={styles.closeButton} 
                aria-label="Close modal"
                style={{ color: "white" }}
              >
                <FaTimes />
              </button>
            </div>
            <div className={`${styles.modalContent} text-center`} style={{ 
              padding: "20px",
              backgroundColor: "white"
            }}>
              <div className="mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill={colors.primary}>
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                </svg>
              </div>
              
              <p style={{ 
                color: colors.primary900,
                marginBottom: "20px",
                fontSize: "0.9rem"
              }}>Your changes have been saved successfully.</p>
              <button
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  padding: "6px 15px",
                  fontSize: "0.9rem"
                }}
                className="btn btn-primary"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal - Reduced size with theme */}
      {showErrorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer} style={{ 
            maxWidth: "350px",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <div className={styles.modalHeader} style={{ 
              backgroundColor: colors.primary700,
              padding: "15px 20px"
            }}>
              <h3 style={{ 
                color: "white",
                margin: 0,
                fontSize: "1.2rem"
              }}>Error</h3>
              <button 
                onClick={() => setShowErrorModal(false)} 
                className={styles.closeButton} 
                aria-label="Close modal"
                style={{ color: "white" }}
              >
                <FaTimes />
              </button>
            </div>
            <div className={`${styles.modalContent} text-center`} style={{ 
              padding: "20px",
              backgroundColor: "white"
            }}>
              <div className="mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#dc3545">
                  <path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
                </svg>
              </div>
              
              <p style={{ 
                color: colors.primary900,
                marginBottom: "20px",
                fontSize: "0.9rem"
              }}>{errorMessage}</p>
              <button
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  padding: "6px 15px",
                  fontSize: "0.9rem"
                }}
                className="btn btn-primary"
                onClick={() => setShowErrorModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;