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
        borderColor: colors.map(color => color + "99"),
        borderWidth: 2,
        hoverBackgroundColor: colors.map(color => color + "CC"),
        hoverBorderColor: colors.map(color => color),
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 15,
          boxHeight: 15,
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: '500'
          },
          color: '#2a3c50',
        }
      },
      tooltip: {
        backgroundColor: "#2d455f",
        titleFont: { 
          family: "'Inter', sans-serif",
          size: 13, 
          weight: "600" 
        },
        bodyFont: { 
          family: "'Inter', sans-serif",
          size: 13 
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const value = context.raw;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: "35%", // Donut style
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
      easing: 'easeOutQuart'
    }
  };

  // Calculate totals for the summary
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>{title}</h3>
      </div>
      
      <div className={styles.chartContent}>
        <div className={styles.chartWrapper}>
          <Pie data={data} options={options} />
        </div>
        
        
      </div>
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
