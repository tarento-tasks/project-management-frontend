import React from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
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
      <Pie data={data} />
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
