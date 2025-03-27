import React from 'react';
import ProjectsList from './ProjectsList';

export default {
  title: 'Components/ProjectsList',
  component: ProjectsList,
};

const Template = (args) => <ProjectsList {...args} />;

export const Default = Template.bind({});
Default.args = {
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      objective: "Build a React-based online store with payment integration",
      mentor: "Dr. Smith",
      skills: ["React", "Node.js", "MongoDB"],
      lastDate: "2023-12-15",
      dueDate: "2024-02-28"
    },
    {
      id: 2,
      title: "AI Chatbot",
      objective: "Develop a Python-based conversational AI",
      mentor: "Prof. Johnson",
      skills: ["Python", "NLP", "TensorFlow"],
      lastDate: "2023-11-30",
      dueDate: "2024-01-15"
    },
    {
      id: 3,
      title: "Mobile Health App",
      objective: "Create a Flutter app for health tracking",
      mentor: "Dr. Williams",
      skills: ["Flutter", "Firebase", "Dart"],
      lastDate: "2024-01-10",
      dueDate: "2024-03-20"
    },
    {
      id: 4,
      title: "Blockchain Voting System",
      objective: "Implement a secure voting system using Ethereum",
      mentor: "Prof. Brown",
      skills: ["Solidity", "Web3.js", "Blockchain"],
      lastDate: "2023-12-01",
      dueDate: "2024-01-30"
    }
  ]
};

export const EmptyState = Template.bind({});
EmptyState.args = {
  projects: []
};

export const SingleProject = Template.bind({});
SingleProject.args = {
  projects: [
    {
      id: 1,
      title: "Single Project Example",
      objective: "This demonstrates how the component looks with just one project",
      mentor: "Dr. Example",
      skills: ["React", "CSS"],
      lastDate: "2023-12-31",
      dueDate: "2024-02-15"
    }
  ]
};

export const ClosedProjects = Template.bind({});
ClosedProjects.args = {
  projects: [
    {
      id: 5,
      title: "Closed Project",
      objective: "This project should not appear as enrollment is closed",
      mentor: "Prof. Closed",
      skills: ["Java", "Spring"],
      lastDate: "2023-10-01", // Past date
      dueDate: "2023-12-15"
    }
  ]
};