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
    projectStatus: "To Be Reviewed",
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
    projectStatus: "To Be Reviewed",
  },
];

const AllProjects = () => {
  // Categorize projects
  const inProgress = dummyProjects.filter(p => p.projectStatus === "In Progress");
  const toBeReviewed = dummyProjects.filter(p => p.projectStatus === "To Be Reviewed");
  const completed = dummyProjects.filter(p => p.projectStatus === "Completed");

  return (
    <DashboardLayout>
      <div className={styles.allprojectscontainer}>
        <h2 className={styles.allprojectstitle}></h2>

        <div className={styles.kanbanBoard}>
          {/* In Progress Column */}
          <div className={`${styles.column} ${styles.inProgress}`}>
            <h3> In Progress</h3>
            {inProgress.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          {/* To Be Reviewed Column */}
          <div className={`${styles.column} ${styles.toBeReviewed}`}>
            <h3> To Be Reviewed</h3>
            {toBeReviewed.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          {/* Completed Column */}
          <div className={`${styles.column} ${styles.completed}`}>
            <h3> Completed</h3>
            {completed.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllProjects;
