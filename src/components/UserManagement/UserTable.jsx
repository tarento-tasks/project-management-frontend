import React, { useState } from 'react';
import styles from './userTable.module.css';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const UserTable = ({ users, onDelete, onEdit, onView }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, userId) => {
    e.stopPropagation();
    
    // Validate userId is present
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    setDeletingId(userId);
    try {
      await onDelete(userId);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Qualifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userId} onClick={() => onView(user)} className={styles.tableRow}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.qualifications || 'N/A'}</td>
                <td className={styles.actions}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(user);
                    }} 
                    className={styles.editButton}
                    title="Edit user"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, user.userId)}
                    className={styles.deleteButton}
                    disabled={deletingId === user.userId}
                    title="Delete user"
                  >
                    {deletingId === user.userId ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <FiTrash2 />
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noData}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;