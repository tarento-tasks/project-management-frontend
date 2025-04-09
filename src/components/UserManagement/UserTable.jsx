import React, { useState } from 'react';
import styles from './userTable.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserTable = ({ users, onDelete, onEdit, onView }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, userId) => {
    e.stopPropagation();
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
    <div className={`container mt-3 ${styles.tableContainer}`}>
      {users.length > 0 ? (
        <div className="row">
          {users.map((user) => (
            <div
              className={`col-12 ${styles.cardRow}`}
              key={user.userId}
              onClick={() => onView(user)}
            >
              <div className="d-flex justify-content-between flex-wrap align-items-start">
                <div>
                  <div className={styles.cardName}>{user.name}</div>
                  <div className={styles.cardEmail}>{user.email}</div>
                  <div className={styles.cardQual}>
                    {user.qualifications || 'N/A'}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(user);
                    }}
                    className={`btn btn-sm ${styles.editButton}`}
                    title="Edit user"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, user.userId)}
                    className={`btn btn-sm ${styles.deleteButton}`}
                    disabled={deletingId === user.userId}
                    title="Delete user"
                  >
                    {deletingId === user.userId ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <FiTrash2 />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted py-5">No users found</div>
      )}
    </div>
  );
};

export default UserTable;
