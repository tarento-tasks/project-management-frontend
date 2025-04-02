import React, { useState, useEffect } from "react";
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from "sweetalert2";
import styles from "./newTask.module.css";
import { getUserProfile, getMentorProjects, getProjectStudents, createTask } from "../../services/taskService";

const NewTask = () => {
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentorId, setMentorId] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserProfile();
        setMentorId(user.userId);
        const mentorProjects = await getMentorProjects(user.userId);
        setProjects(mentorProjects);
      } catch (error) {
        console.error("Error fetching mentor projects:", error);
      }
    };
    fetchData();
  }, []);

  const handleProjectChange = async (projectId) => {
    setSelectedProject(projectId);
    try {
      const enrolledStudents = await getProjectStudents(projectId);
      setStudents(enrolledStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fields = [
    {
      name: "projectId",
      label: "Project Title",
      type: "select",
      options: projects.map((p) => ({ value: p.projectId, label: p.title })),
      required: true,
      validation: { message: "Please select a project title" },
      onChange: handleProjectChange
    },
    {
      name: "taskName",
      label: "Task Name",
      type: "text",
      placeholder: "Enter task name",
      required: true,
      validation: { minLength: 3, maxLength: 50, message: "Task name must be 3-50 characters long" }
    },
    {
      name: "objective",
      label: "Objective",
      type: "text",
      placeholder: "Enter objective",
      required: true,
      validation: { minLength: 10, maxLength: 200, message: "Objective must be 10-200 characters long" }
    },
    {
      name: "studentId",
      label: "Assign Student",
      type: "select",
      options: students.map((s) => ({ value: s.studentId, label: s.name })),
      required: true,
      validation: { message: "Please select a student" }
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "date",
      required: true,
      validation: { isFutureDate: true, message: "Due date must be in the future" }
    }
  ];

  const handleSubmit = async (formData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(formData.dueDate);

    if (dueDate <= today) {
      Swal.fire({ title: "Error!", text: "Due date must be in the future", icon: "error", confirmButtonText: "OK", confirmButtonColor: "#517ea6" });
      return;
    }

    const taskData = {
      projectId: formData.projectId,
      mentorId: mentorId,
      taskName: formData.taskName,
      taskObjective: formData.objective,
      studentId: formData.studentId,
      dueDate: formData.dueDate
    };

    try {
      const response = await createTask(taskData);
      Swal.fire({ title: "Success!", text: response.message, icon: "success", confirmButtonText: "OK", confirmButtonColor: "#517ea6", timer: 1000 });
    } catch (error) {
      Swal.fire({ title: "Error!", text: error.response?.data?.message || "Failed to create task", icon: "error", confirmButtonText: "OK", confirmButtonColor: "#517ea6" });
    }
  };

  return (
    <NewProjectLayout>
      <div className={styles.pageContainer}>
        <h1>Create New Task</h1>
        <p>Fill out the form below to create a new task</p>
        <FormComponent fields={fields} onSubmit={handleSubmit} validateOnBlur={true} validateOnChange={false} />
      </div>
    </NewProjectLayout>
  );
};

export default NewTask;
