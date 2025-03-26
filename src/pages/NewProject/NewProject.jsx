
import React from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import DashboardLayout from "../../layouts/DashboardLayout";  // Correct path
import styles from "./newProject.module.css"; 

const NewProject = () => {
  const skills = ["React", "Spring Boot", "Java", "Python", "Node.js", "Docker"];
  const mentors = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis"];

  const fields = [
    { 
      name: "title", 
      label: "Project Title", 
      type: "text", 
      placeholder: "Enter project title",
      required: true 
    },
    { 
      name: "objective", 
      label: "Objective", 
      type: "text", 
      placeholder: "Enter project objective",
      required: true 
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea", 
      placeholder: "Enter detailed description",
      rows: 5,
      required: true 
    },
    { 
      name: "eligibility", 
      label: "Eligibility Criteria", 
      type: "textarea", 
      placeholder: "Enter eligibility requirements",
      rows: 3 
    },
    { 
      name: "skills", 
      label: "Skills Required", 
      type: "select", 
      options: skills,
      required: true 
    },
    { 
      name: "mentor", 
      label: "Mentor", 
      type: "select", 
      options: mentors,
      required: true 
    },
    { 
      name: "lastDate", 
      label: "Last Date to Enroll", 
      type: "date",
      required: true 
    },
    { 
      name: "dueDate", 
      label: "Project Due Date", 
      type: "date",
      required: true 
    }
  ];

  const handleSubmit = (formData) => {
    console.log('Project submitted:', formData);
    alert('Project created successfully!');
  };

  return (
    <DashboardLayout role="admin" userName="Admin" userRole="Administrator">
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>Create New Project</h1>
          <p>Fill out the form below to create a new project</p>
        </div>
        <div className={styles.formWrapper}>
          <FormComponent 
            fields={fields} 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;