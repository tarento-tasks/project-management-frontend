import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import styles from "./cardComponent.module.css";
import { Card, Table } from "react-bootstrap";

const statusColors = {
  Completed: "text-success",
  pending: "text-warning",
  In_Progress: "text-danger",
};

const CardComponent = ({ title = "Default Title", fields = [], data = [] }) => {
  return (
    <Card className={styles.cardContainer}>
      <Card.Header className={styles.cardHeader}>
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.key}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map((field) => {
                  const statusClass =
                    field.key === "status" ? statusColors[row[field.key]?.toLowerCase()] : "";

                  return (
                    <td key={field.key} className={`${statusClass} p-2`}>
                      {row[field.key] || "-"}
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
