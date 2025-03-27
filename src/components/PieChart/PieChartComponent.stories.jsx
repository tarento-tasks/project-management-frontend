import React from "react";
import PieChartComponent from "./PieChartComponent";

export default {
  title: "Components/PieChartComponent",
  component: PieChartComponent,
};

const Template = (args) => <PieChartComponent {...args} />;

export const AdminProgress = Template.bind({});
AdminProgress.args = {
  title: "Admin Project Progress",
  labels: ["Completed Projects", "Pending Projects"],
  values: [10, 5], // Example data
  colors: ["#28a745", "#ffc107"], // Green & Yellow
};

export const MentorProgress = Template.bind({});
MentorProgress.args = {
  title: "Mentor Task Progress",
  labels: ["Reviewed Tasks", "Pending Tasks"],
  values: [15, 7], // Example data
  colors: ["#007bff", "#dc3545"], // Blue & Red
};

export const StudentProgress = Template.bind({});
StudentProgress.args = {
  title: "Student Task Progress",
  labels: ["Completed Tasks", "Pending Tasks"],
  values: [20, 10], // Example data
  colors: ["#17a2b8", "#6c757d"], // Cyan & Grey
};
