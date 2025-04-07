import React, { useState, useEffect } from 'react';
import styles from './newTaskModal.module.css';
import React, { useState, useEffect } from "react";
import FormComponent from "../Forms/FormComponent";
import Swal from "sweetalert2";
import styles from "./NewTaskModal.module.css";
import { getProjectStudents, createTask } from "../../services/taskService";
const NewTaskModal = ({ task, onClose, onSave, isEditMode, isCreateMode, assignedStudents = [] }) => {
  const [formData, setFormData] = useState({
    taskId: '',
    title: '',
    description: '',
    dueDate: '',
    assignedToUserId: '',
    attachments: null,
    attachmentsFile: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        taskId: task.taskId || '',
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        assignedToUserId: task.assignedToUserId || '',
        attachments: task.attachments || null,
        attachmentsFile: null
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachmentsFile: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.assignedToUserId) newErrors.assignedToUserId = 'Assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>{isCreateMode ? 'Create New Task' : isEditMode ? 'Edit Task' : 'Task Details'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                readOnly={!isCreateMode && !isEditMode}
                className={errors.title ? styles.errorInput : ''}
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                readOnly={!isCreateMode && !isEditMode}
                className={errors.dueDate ? styles.errorInput : ''}
              />
              {errors.dueDate && <span className={styles.errorText}>{errors.dueDate}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Assign To *</label>
              {(isCreateMode || isEditMode) ? (
                <select
                  name="assignedToUserId"
                  value={formData.assignedToUserId}
                  onChange={handleChange}
                  className={errors.assignedToUserId ? styles.errorInput : ''}
                >
                  <option value="">Select a student</option>
                  {assignedStudents.map(student => (
                    <option key={student.userId} value={student.userId}>
                      {student.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={
                    assignedStudents.find(u => u.userId === formData.assignedToUserId)?.name || 'N/A'
                  }
                  readOnly
                />
              )}
              {errors.assignedToUserId && <span className={styles.errorText}>{errors.assignedToUserId}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                readOnly={!isCreateMode && !isEditMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Attachment</label>
              {formData.attachments && (
                <div>
                  <a
                    href={`data:application/octet-stream;base64,${formData.attachments}`}
                    download="attachment"
                  >
                    Download current attachment
                  </a>
                </div>
              )}
              {(isCreateMode || isEditMode) && (
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              )}
            </div>
          </div>

          {(isCreateMode || isEditMode) && (
            <div className={styles.modalFooter}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
              <button type="submit" className={styles.saveButton}>
                {isCreateMode ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
