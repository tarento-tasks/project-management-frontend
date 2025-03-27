import React from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from 'sweetalert2';
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
    
   
    Swal.fire({
      title: 'Success!',
      text: 'Project created successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#517ea6',
      timer: 1000,
     
    });
  };

  return (
    <NewProjectLayout>
        <div className={styles.pageContainer}>
            <h1>Create New Project</h1>
            <p>Fill out the form below to create a new project</p>
            <FormComponent fields={fields} onSubmit={handleSubmit} />
        </div>
    </NewProjectLayout>
  );
};

export default NewProject;