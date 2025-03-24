import React from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./pieChartComponent.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ title, labels, values }) => {
  const bigStoneColors = [
    "#517ea6", // 500
    "#3e648b", // 600
    "#335171", // 700
    "#2d455f", // 800
    "#2a3c50", // 900
    "#212e3f", // 950
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: bigStoneColors.slice(0, values.length),
        hoverBackgroundColor: bigStoneColors.slice(0, values.length).map(color => color + "CC"),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          font: {
            size: 14,
            weight: "bold",
            family: "Poppins, sans-serif", 
          },
          color: "#2a3c50", 
          textAlign: "left",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let dataset = tooltipItem.dataset;
            let currentValue = dataset.data[tooltipItem.dataIndex];
            let total = dataset.data.reduce((acc, val) => acc + val, 0);
            let percentage = ((currentValue / total) * 100).toFixed(2);
            return ` ${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          },
        },
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        backgroundColor: "#2d455f",
        bodyColor: "#fff",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.chartContainer}>
      <h5 className={styles.chartTitle}>{title}</h5>
      <div className={styles.pieChartWrapper}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

PieChartComponent.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PieChartComponent;
