import React, { useState, useEffect } from "react";
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from "sweetalert2";
import styles from "./newTask.module.css";
import {
  getUserProfile,
  getMentorProjects,
  getProjectStudents,
  createTask,
  assignStudentToTask
} from "../../services/taskService";

const NewTask = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [mentorProjects, setMentorProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentorId, setMentorId] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await getUserProfile();
        console.log("Logged-in user:", user);
        setMentorId(user.userId);

        // Fetch all projects first
        const allProjects = await getMentorProjects();
        console.log("All projects:", allProjects);
        setAllProjects(allProjects);

        // Filter projects where mentorId matches logged-in mentor's userId
        const filteredProjects = allProjects.filter(project => project.mentorId === user.userId);
        console.log("Filtered Mentor Projects:", filteredProjects);
        setMentorProjects(filteredProjects);

      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load projects data",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#517ea6"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProjectChange = async (projectId) => {
    console.log("Project selected:", projectId);
    setSelectedProject(projectId);
    
    try {
      const enrolledStudents = await getProjectStudents(projectId);
      console.log("Approved students for project:", enrolledStudents);
      
      // Filter only approved students
      const approvedStudents = enrolledStudents.filter(student => 
        student.status === 'APPROVED' // Assuming status field exists
      );
      
      setStudents(approvedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load students for this project",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#517ea6"
      });
      setStudents([]);
    }
  };

  const fields = [
    {
      name: "projectId",
      label: "Project Title",
      type: "select",
      options: mentorProjects.map((p) => ({ 
        value: p.projectId, 
        label: p.title 
      })),
      required: true,
      validation: { message: "Please select a project title" },
      onChange: (e) => handleProjectChange(e.target.value)
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
      name: "studentId",
      label: "Assign Student",
      type: "select",
      options: students.map((s) => ({
        value: s.studentId,
        label: s.name
      })),
      required: true,
      validation: { message: "Please select a student" },
      disabled: students.length === 0
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

  const handleSubmit = async (formData) => {
    console.log("Form submission started with data:", formData);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(formData.dueDate);

    if (dueDate <= today) {
      Swal.fire({
        title: "Error!",
        text: "Due date must be in the future",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#517ea6"
      });
      return;
    }

    const taskData = {
      projectId: formData.projectId,
      mentorId,
      taskName: formData.taskName,
      taskObjective: formData.objective,
      dueDate: formData.dueDate
    };

    try {
      const createdTask = await createTask(taskData);
      console.log("Created task:", createdTask);

      const taskId = createdTask.taskId;
      await assignStudentToTask(taskId, formData.studentId);
      console.log(`Assigned student ${formData.studentId} to task ${taskId}`);

      Swal.fire({
        title: "Success!",
        text: "Task created and student assigned successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#517ea6",
        timer: 1200
      });
    } catch (error) {
      console.error("Task creation or assignment failed:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong while creating the task",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#517ea6"
      });
    }
  };

  if (loading) {
    return (
      <NewProjectLayout>
        <div className={styles.pageContainer}>
          <h1>Create New Task</h1>
          <p>Loading projects data...</p>
        </div>
      </NewProjectLayout>
    );
  }

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