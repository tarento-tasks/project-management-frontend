import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CreateTask from "../../components/CreateTask/CreateTask"; 
import styles from "./newtask.module.css";

const students = ["Student A", "Student B", "Student C"]; // Sample students list

const NewTask = () => {
  return (
    <DashboardLayout>
      <div className={styles.newTaskContainer}>
        <h2 className={styles.pageTitle}></h2>
        <CreateTask students={students} />
      </div>
    </DashboardLayout>
  );
};

export default NewTask;
