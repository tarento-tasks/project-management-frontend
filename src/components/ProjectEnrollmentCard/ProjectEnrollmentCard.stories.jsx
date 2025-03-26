import React from "react";
import ProjectEnrollmentCard from "./ProjectEnrollmentCard";

export default {
  title: "Components/ProjectEnrollmentCard",
  component: ProjectEnrollmentCard,
};

const Template = (args) => <ProjectEnrollmentCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "AI Chatbot Development",
  objective: "Develop an AI chatbot",
  description: "A chatbot that helps users with queries",
  prerequisites: "Basic JavaScript & AI concepts",
  mentor: "Dr. John Doe",
  lastDate: "2025-04-15",
};
