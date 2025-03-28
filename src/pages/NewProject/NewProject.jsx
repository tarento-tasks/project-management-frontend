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
      required: true,
      validation: {
        minLength: 5,
        maxLength: 100,
        message: "Title must be between 5-100 characters"
      }
    },
    { 
      name: "objective", 
      label: "Objective", 
      type: "text", 
      placeholder: "Enter project objective",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200,
        message: "Objective must be between 10-200 characters"
      }
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea", 
      placeholder: "Enter detailed description",
      rows: 5,
      required: true,
      validation: {
        minLength: 20,
        maxLength: 1000,
        message: "Description must be between 20-1000 characters"
      }
    },
    { 
      name: "eligibility", 
      label: "Eligibility Criteria", 
      type: "textarea", 
      placeholder: "Enter eligibility requirements",
      rows: 3,
      validation: {
        maxLength: 500,
        message: "Eligibility criteria cannot exceed 500 characters"
      }
    },
    { 
      name: "skills", 
      label: "Skills Required", 
      type: "select", 
      options: skills,
      required: true,
      validation: {
        message: "Please select at least one skill"
      }
    },
    { 
      name: "mentor", 
      label: "Mentor", 
      type: "select", 
      options: mentors,
      required: true,
      validation: {
        message: "Please select a mentor"
      }
    },
    { 
      name: "lastDate", 
      label: "Last Date to Enroll", 
      type: "date",
      required: true,
      validation: {
        isFutureDate: true,
        message: "Last date must be in the future"
      }
    },
    { 
      name: "dueDate", 
      label: "Project Due Date", 
      type: "date",
      required: true,
      validation: {
        isAfterField: "lastDate",
        message: "Due date must be after last enrollment date"
      }
    }
  ];

  const handleSubmit = (formData) => {
    console.log('Project submitted:', formData);
    
    // Additional validation before submission
    if (new Date(formData.dueDate) <= new Date(formData.lastDate)) {
      Swal.fire({
        title: 'Error!',
        text: 'Due date must be after last enrollment date',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#517ea6'
      });
      return;
    }

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
            <FormComponent 
              fields={fields} 
              onSubmit={handleSubmit} 
              validateOnBlur={true}
              validateOnChange={true}
            />
        </div>
    </NewProjectLayout>
  );
};

export default NewProject;