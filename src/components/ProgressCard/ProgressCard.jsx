import React from "react";
import PropTypes from "prop-types";
import { Card, Row, Col } from "react-bootstrap";
import styles from "./progressCard.module.css"; // Optional for styling

const ProgressCard = ({ title, data }) => {
  return (
    <Card className={`p-3 ${styles.outerCard}`}>
      <Card.Body>
        <Card.Title className="text-center mb-3">{title}</Card.Title>
        <Row className="g-3">
          {data.map((item, index) => (
            <Col key={index} xs={12} md={4}>
              <Card className={`text-center ${styles.innerCard}`}>
                <Card.Body>
                  <Card.Title className={styles.cardTitle}>{item.title}</Card.Title>
                  <Card.Text className={styles.cardNumber}>{item.value}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

ProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProgressCard;
