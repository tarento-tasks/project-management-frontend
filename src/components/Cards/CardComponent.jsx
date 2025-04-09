// src/components/Cards/CardComponent.jsx
import React from "react";
import PropTypes from "prop-types";
import { Card, Table } from "react-bootstrap";
import styles from "./cardComponent.module.css";

const CardComponent = ({ title, fields, data }) => {
  // Enhanced status color mapping using your color palette
  const statusColors = {
    approved: styles.statusApproved,
    open: styles.statusOpen,
    pending: styles.statusPending,
    rejected: styles.statusRejected,
    closed: styles.statusClosed,
    completed: styles.statusApproved
  };

  // Progress bar renderer for progress cells
  const renderContent = (value, fieldKey) => {
    // Check if this is a progress field and contains a percentage
    if (fieldKey === "progress" && typeof value === 'string' && value.endsWith('%')) {
      const percentage = parseInt(value);
      return (
        <div className={styles.progressWrapper}>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: value }}
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <span className={styles.progressText}>{value}</span>
        </div>
      );
    }
    return value;
  };

  return (
    <Card className={styles.cardContainer}>
      <Card.Header className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
      </Card.Header>
      <Card.Body className={styles.cardBody}>
        <div className={styles.tableWrapper}>
          <Table hover responsive className={styles.cardTable}>
            <thead>
              <tr className={styles.tableHeader}>
                {fields.map((field, index) => (
                  <th key={index} className={styles.tableHeaderCell}>
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className={styles.tableRow}>
                    {fields.map((field, colIndex) => {
                      // Get the value for this cell
                      const value = row[field.key];
                      
                      // Determine if this is a status cell
                      const isStatusCell = field.key.toLowerCase() === 'status';
                      
                      // Get the appropriate status class if applicable
                      const statusClass = isStatusCell && value ? 
                        statusColors[value.toLowerCase()] || '' : '';
                      
                      return (
                        <td key={colIndex} className={`${styles.tableCell} ${statusClass}`}>
                          {renderContent(value, field.key)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={fields.length} className={styles.emptyState}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CardComponent;