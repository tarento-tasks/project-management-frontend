import React, { useState } from "react";
import styles from "./table.module.css";
import { FiEdit2, FiTrash2, FiEye, FiMoreVertical } from "react-icons/fi";

const Table = ({ columns = [], data = [], onDelete, onEdit, onView }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  // Safe default values for optional props
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!id) {
      console.error("ID is undefined");
      return;
    }

    setDeletingId(id);
    try {
      onDelete && await onDelete(id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
      setActiveRow(null);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {safeColumns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onView || onEdit || onDelete) && <th style={{ width: "60px" }}></th>}
          </tr>
        </thead>
        <tbody>
          {safeData.length > 0 ? (
            safeData.map((row) => {
              const rowId = row.commentId || row.feedbackId || Math.random().toString(36).substring(2, 9);
              return (
                <tr
                  key={rowId}
                  className={styles.tableRow}
                  onMouseEnter={() => setActiveRow(rowId)}
                  onMouseLeave={() => setActiveRow(null)}
                >
                  {safeColumns.map((col) => (
                    <td key={`${rowId}-${col.key}`}>
                      <div className={styles.cellContent}>
                        {row[col.key] || "N/A"}
                      </div>
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td>
                      <div className={styles.actionCell}>
                        {activeRow === rowId ? (
                          <div className={styles.actionButtons}>
                            {onView && (
                              <button
                                onClick={() => onView(row)}
                                className={styles.viewButton}
                                title="View"
                              >
                                <FiEye />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className={styles.editButton}
                                title="Edit"
                              >
                                <FiEdit2 />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={(e) => handleDelete(e, rowId)}
                                className={styles.deleteButton}
                                disabled={deletingId === rowId}
                                title="Delete"
                              >
                                {deletingId === rowId ? (
                                  <div className={styles.spinner}></div>
                                ) : (
                                  <FiTrash2 />
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <FiMoreVertical className={styles.moreIcon} />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={safeColumns.length + ((onView || onEdit || onDelete) ? 1 : 0)} className={styles.noData}>
                <div className={styles.noDataContent}>
                  <div className={styles.noDataIcon}>📊</div>
                  <div>No records found</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;