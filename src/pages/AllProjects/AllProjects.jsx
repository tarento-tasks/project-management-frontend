import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import styles from "./allProjects.module.css";

const dummyProjects = [
  {
    projectName: "Project Alpha",
    projectDescription: "This is a project about developing an AI system.",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    duration: "6 months",
    tasksLeft: 5,
    totalTasks: 20,
    mentorName: "John Doe",
    teamMembers: ["Alice", "Bob", "Charlie"],
    projectStatus: "In Progress",
  },
  {
    projectName: "Project Beta",
    projectDescription: "Blockchain based payment platform.",
    startDate: "2024-02-15",
    endDate: "2024-07-15",
    duration: "5 months",
    tasksLeft: 0,
    totalTasks: 15,
    mentorName: "Jane Smith",
    teamMembers: ["David", "Eve"],
    projectStatus: "Completed",
  },
  {
    projectName: "Project Gamma",
    projectDescription: "A cloud migration project.",
    startDate: "2024-03-10",
    endDate: "2024-08-10",
    duration: "5 months",
    tasksLeft: 10,
    totalTasks: 25,
    mentorName: "Robert Johnson",
    teamMembers: ["Frank", "Grace", "Hannah", "Ivy"],
    projectStatus: "In Progress",
  },
  {
    projectName: "Project Gamma",
    projectDescription: "A cloud migration project.",
    startDate: "2024-03-10",
    endDate: "2024-08-10",
    duration: "5 months",
    tasksLeft: 10,
    totalTasks: 25,
    mentorName: "Robert Johnson",
    teamMembers: ["Frank", "Grace", "Hannah", "Ivy"],
    projectStatus: "In Progress",
  },

  {
    projectName: "Project Gamma",
    projectDescription: "A cloud migration project.",
    startDate: "2024-03-10",
    endDate: "2024-08-10",
    duration: "5 months",
    tasksLeft: 10,
    totalTasks: 25,
    mentorName: "Robert Johnson",
    teamMembers: ["Frank", "Grace", "Hannah", "Ivy"],
    projectStatus: "In Progress",
  },

  {
    projectName: "Project Gamma",
    projectDescription: "A cloud migration project.",
    startDate: "2024-03-10",
    endDate: "2024-08-10",
    duration: "5 months",
    tasksLeft: 10,
    totalTasks: 25,
    mentorName: "Robert Johnson",
    teamMembers: ["Frank", "Grace", "Hannah", "Ivy"],
    projectStatus: "In Progress",
  },


  {
    projectName: "Project Gamma",
    projectDescription: "A cloud migration project.",
    startDate: "2024-03-10",
    endDate: "2024-08-10",
    duration: "5 months",
    tasksLeft: 10,
    totalTasks: 25,
    mentorName: "Robert Johnson",
    teamMembers: ["Frank", "Grace", "Hannah", "Ivy"],
    projectStatus: "In Progress",
  },
  // Add as many dummy projects as you want
];

const AllProjects = () => {
  return (
    <DashboardLayout>
      <div className={styles.allprojectscontainer}>
        <h2 className={styles.allprojectstitle}>All Projects</h2>
        <div className={styles.cardsGrid}>
          {dummyProjects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllProjects;
