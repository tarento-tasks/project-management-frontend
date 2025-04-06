import React, { useState } from "react";
import styles from "./table.module.css";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

const Table = ({ columns, data, onDelete, onEdit, onView }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!id) return console.error("ID is undefined");

    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} onClick={() => onView(row)} className={styles.tableRow}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key] || "N/A"}</td>
                ))}
                <td className={styles.actions}>
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                      className={styles.editButton}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => handleDelete(e, row.id)}
                      className={styles.deleteButton}
                      disabled={deletingId === row.id}
                      title="Delete"
                    >
                      {deletingId === row.id ? <span className={styles.spinner}></span> : <FiTrash2 />}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className={styles.noData}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
