import React from "react";
import ProjectCard from "./ProjectCard";

export default {
  title: "Components/ProjectCard",
  component: ProjectCard,
};

const Template = (args) => <ProjectCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectName: "AI Chatbot",
  projectDescription: "A chatbot powered by AI to assist users in daily tasks.",
  startDate: "March 1, 2025",
  endDate: "June 1, 2025",
  duration: "3 months",
  tasksLeft: 2,
  totalTasks: 10,
  mentorName: "Dr. John Doe",
  teamMembers: ["Alice", "Bob", "Charlie"],
  projectStatus: "In Progress",

};
