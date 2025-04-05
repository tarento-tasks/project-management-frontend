import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserEdit, FaTimes, FaPlus } from "react-icons/fa";
import { logout } from "../../services/authService";
import { fetchCurrentUser, updateUserProfile, fetchAllSkills, getUserSkills, addSkillToUser } from "../../services/headerService";
import defaultProfileImage from "../../assets/default-dp.jpeg";

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
  const [selectedSkill, setSelectedSkill] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    previousWork: "",
    qualifications: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userData) return;
      
      const updatedData = {
        ...userData,
        ...formData
      };
      
      await updateUserProfile(updatedData, imageFile);
      
      // Add new skill if selected
      if (selectedSkill) {
        await addSkillToUser(userData.userId, selectedSkill);
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
      
      setShowEditProfileModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
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
                  <label htmlFor="password" className="form-label">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleInputChange}
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

                {/* Skills Section */}
                <div className="mb-3">
                  <label htmlFor="skillSelect" className="form-label">Add Skill</label>
                  <div className="d-flex">
                    <select
                      id="skillSelect"
                      className="form-select me-2"
                      value={selectedSkill}
                      onChange={handleSkillChange}
                    >
                      <option value="">Select a skill</option>
                      {allSkills.map(skill => (
                        <option key={skill.skillId} value={skill.skillId}>
                          {skill.skillName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {userSkills.length > 0 && (
                  <div className="mb-3">
                    
                    <div className="d-flex flex-wrap gap-2">
                      {userSkills.map((skill, index) => (
                        <span key={index} className="badge bg-primary">
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
    </>
  );
};

export default Header;