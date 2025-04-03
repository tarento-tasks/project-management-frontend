import React, { useState, useEffect } from 'react';
import styles from './userModal.module.css';

const UserModal = ({ user, roles, onClose, onSave, isEditMode, isCreateMode }) => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    password: '',
    dob: '',
    previousWork: '',
    qualifications: '',
    roleId: '',
    image: null,
    imageFile: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId || '',
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        dob: user.dob || '',
        previousWork: user.previousWork || '',
        qualifications: user.qualifications || '',
        roleId: user.roleId || '',
        image: user.imageBase64 || null,
        imageFile: null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (isCreateMode && !formData.password) newErrors.password = 'Password is required';
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Unknown Role';
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>{isCreateMode ? 'Create New User' : isEditMode ? 'Edit User' : 'User Details'}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                readOnly={!isEditMode && !isCreateMode}
                className={errors.name ? styles.errorInput : ''}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={!isEditMode && !isCreateMode}
                className={errors.email ? styles.errorInput : ''}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            {isCreateMode && (
              <div className={styles.formGroup}>
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={errors.password ? styles.errorInput : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                readOnly={!isEditMode && !isCreateMode}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Role *</label>
              {isEditMode || isCreateMode ? (
                <>
                  <select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    required
                    className={errors.roleId ? styles.errorInput : ''}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && <span className={styles.errorText}>{errors.roleId}</span>}
                </>
              ) : (
                <input
                  type="text"
                  value={getRoleName(formData.roleId)}
                  readOnly
                />
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label>Previous Work</label>
              <textarea
                name="previousWork"
                value={formData.previousWork}
                onChange={handleChange}
                rows="3"
                readOnly={!isEditMode && !isCreateMode}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Qualifications</label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows="3"
                readOnly={!isEditMode && !isCreateMode}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Profile Image</label>
              {(previewImage || formData.image) && (
                <div className={styles.imagePreview}>
                  <img 
                    src={previewImage || `data:image/jpeg;base64,${formData.image}`} 
                    alt="Profile" 
                  />
                </div>
              )}
              {(isEditMode || isCreateMode) && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              )}
            </div>
          </div>
          
          {(isEditMode || isCreateMode) && (
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveButton}
              >
                {isCreateMode ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserModal;