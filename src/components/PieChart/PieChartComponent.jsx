import React from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2"; // Changed from Pie to Doughnut
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./pieChartComponent.module.css";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ title, labels, values, colors }) => {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(color => color + "CC"), // Slightly transparent on hover
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <h5 className="text-center">{title}</h5>
      <Doughnut data={data} /> {/* Changed from Pie to Doughnut */}
    </div>
  );
};

PieChartComponent.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PieChartComponent;