import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import styles from "./cardComponent.module.css";
import { Card, Table } from "react-bootstrap";


const statusColors = {
  approved: "text-success",
  pending: "text-warning",
  rejected: "text-danger",
};

const CardComponent = ({ title, fields, data }) => {
  return (
    <Card className={styles.cardContainer}>
      <Card.Header className={styles.cardHeader}>{title}</Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {fields.map((field, index) => (
                <th key={index}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map((field, colIndex) => {
                  // Get the class name based on status
                  const statusClass =
                    field.key === "status" ? statusColors[row[field.key].toLowerCase()] : "";

                  console.log(`Applying class "${statusClass}" for status "${row[field.key]}"`);

                  return (
                    <td key={colIndex} className={statusClass}>
                      {row[field.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
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
