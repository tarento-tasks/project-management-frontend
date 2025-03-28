import React from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from 'sweetalert2';
import styles from "./newUser.module.css";

const NewTask = () => {
  const projectTitles = ["Project A", "Project B", "Project C", "Project D"];
  const students = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince"];

  const fields = [
    { 
      name: "projectTitle", 
      label: "Project Title", 
      type: "select", 
      options: projectTitles,
      required: true 
    },
    { 
      name: "taskName", 
      label: "Task Name", 
      type: "text", 
      placeholder: "Enter task name",
      required: true 
    },
    { 
      name: "objective", 
      label: "Objective", 
      type: "text", 
      placeholder: "Enter objective",
      required: true 
    },
    { 
      name: "student", 
      label: "Add Student", 
      type: "select", 
      options: students,
      required: true 
    },
    { 
      name: "dueDate", 
      label: "Due Date", 
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
            <h1>Create New Task</h1>
            <p>Fill out the form below to create a new user</p>
            <FormComponent fields={fields} onSubmit={handleSubmit} />
        </div>
    </NewProjectLayout>
  );
};

export default NewTask;