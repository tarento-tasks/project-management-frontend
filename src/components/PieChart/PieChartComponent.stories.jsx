import React from "react";
import PieChartComponent from "./PieChartComponent";

export default {
  title: "Components/PieChartComponent",
  component: PieChartComponent,
};

export const AdminProgress = () => (
  <PieChartComponent 
    title="Admin Project Progress"
    labels={["Completed Projects", "Pending Projects"]}
    values={[10, 5]} 
  />
);

export const MentorProgress = () => (
  <PieChartComponent 
    title="Mentor Task Progress"
    labels={["Reviewed Tasks", "Pending Tasks"]}
    values={[15, 7]} 
  />
);

export const StudentProgress = () => (
  <PieChartComponent 
    title="Student Task Progress"
    labels={["Completed Tasks", "Pending Tasks"]}
    values={[20, 10]} 
  />
);
