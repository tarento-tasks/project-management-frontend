import React from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from 'sweetalert2';
import styles from "./newTask.module.css";

const NewTask = () => {
  const projectTitles = ["Project A", "Project B", "Project C", "Project D"];
  const students = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince"];

  const fields = [
    { 
      name: "projectTitle", 
      label: "Project Title", 
      type: "select", 
      options: projectTitles,
      required: true,
      validation: {
        message: "Please select a project title"
      }
    },
    { 
      name: "taskName", 
      label: "Task Name", 
      type: "text", 
      placeholder: "Enter task name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50,
        message: "Task name must be 3-50 characters long"
      }
    },
    { 
      name: "objective", 
      label: "Objective", 
      type: "text", 
      placeholder: "Enter objective",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200,
        message: "Objective must be 10-200 characters long"
      }
    },
    { 
      name: "student", 
      label: "Add Student", 
      type: "select", 
      options: students,
      required: true,
      validation: {
        message: "Please select a student"
      }
    },
    { 
      name: "dueDate", 
      label: "Due Date", 
      type: "date",
      required: true,
      validation: {
        isFutureDate: true,
        message: "Due date must be in the future"
      }
    }
  ];

  const handleSubmit = (formData) => {
    console.log('Task submitted:', formData);
    
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(formData.dueDate);
    
    if (dueDate <= today) {
      Swal.fire({
        title: 'Error!',
        text: 'Due date must be in the future',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#517ea6'
      });
      return;
    }

    Swal.fire({
      title: 'Success!',
      text: 'Task created successfully!',
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
            <p>Fill out the form below to create a new task</p>
            <FormComponent 
              fields={fields} 
              onSubmit={handleSubmit}
              validateOnBlur={true}
              validateOnChange={false}
            />
        </div>
    </NewProjectLayout>
  );
};

export default NewTask;