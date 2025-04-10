import React, { useEffect, useState } from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from 'sweetalert2';
import styles from "./newProject.module.css";
import API from '../../services/api';

// Color palette
const colors = {
  primary: "#517ea6",
  primary600: "#3e648b",
  primary700: "#335171",
  primary800: "#2d455f",
  primary900: "#2a3c50",
  primary950: "#212e3f",
  accent: "#4f46e5",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  light: "#f8fafc",
  gray: "#94a3b8"
};

const NewProject = () => {
  const [skills, setSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsResponse, mentorsResponse] = await Promise.all([
          API.getAllSkills(),
          API.getMentors()
        ]);

        setSkills(skillsResponse.response.map(skill => skill.skillName));
        setMentors(mentorsResponse.response.map(mentor => ({
          userId: mentor.userId,
          name: mentor.name
        })));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to fetch required data');
        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load required data. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: colors.primary
        });
      }
    };

    fetchData();
  }, []);

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
        maxLength: 200
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
        minLength: 50,
        message: "Description should be at least 50 characters"
      }
    },
    { 
      name: "criteria", 
      label: "Eligibility Criteria", 
      type: "textarea", 
      placeholder: "Enter eligibility requirements (one per line)", 
      rows: 3,
      required: true,
      validation: {
        minLength: 20,
        message: "Please provide clear eligibility criteria"
      }
    },
    { 
      name: "skills", 
      label: "Required Skills", 
      type: "select", 
      options: skills, 
      required: true,
      validation: {
        message: "Please select at least one skill"
      }
    },
    {
      name: "repo",
      label: "Repository Link",
      type: "url",
      placeholder: "https://github.com/your-project",
      required: true,
      validation: { 
        maxLength: 255,
        message: "Please enter a valid URL"
      }
    },
    {
      name: "mentor", 
      label: "Project Mentor", 
      type: "select", 
      options: mentors.map(m => ({ value: m.userId, label: m.name })),
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
        message: "Must be a future date"
      }
    },
    { 
      name: "dueDate", 
      label: "Project Due Date", 
      type: "date", 
      required: true,
      validation: {
        isFutureDate: true,
        message: "Must be a future date"
      }
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      if (new Date(formData.dueDate) <= new Date(formData.lastDate)) {
        Swal.fire({
          title: 'Invalid Dates',
          text: 'Due date must be after last enrollment date',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: colors.primary
        });
        return;
      }

      const projectData = {
        title: formData.title,
        objective: formData.objective,
        description: formData.description,
        criteria: formData.criteria,
        repo: formData.repo,
        skills: formData.skills,
        mentorId: formData.mentor,
        lastDate: formData.lastDate,
        dueDate: formData.dueDate,
        openStatus: true
      };

      const projectResponse = await API.createProject(projectData);
      const projectId = projectResponse.response.projectId;

      if (formData.skills?.length > 0) {
        const skillsResponse = await API.getAllSkills();
        const allSkills = skillsResponse.response;

        await Promise.all(formData.skills.map(async (skillName) => {
          const skill = allSkills.find(s => s.skillName === skillName);
          if (skill) {
            await API.mapSkillToProject({
              projectId: projectId,
              skillId: skill.skillId
            });
          }
        }));
      }

      Swal.fire({
        title: 'Project Created!',
        html: `
          <div style="text-align: center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="${colors.success}"/>
            </svg>
            <p style="margin-top: 16px; font-size: 18px;">Your project has been successfully created!</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonColor: colors.primary,
        timer: 3000
      });

    } catch (error) {
      Swal.fire({
        title: 'Creation Failed',
        text: error.response?.data?.message || 'Failed to create project',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: colors.primary
      });
    }
  };

  if (loading) {
    return (
      <NewProjectLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2>Loading Project Data</h2>
          <p>Please wait while we load the required information...</p>
        </div>
      </NewProjectLayout>
    );
  }

  if (error) {
    return (
      <NewProjectLayout>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill={colors.danger}/>
            </svg>
          </div>
          <h2>Data Loading Error</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </NewProjectLayout>
    );
  }

  return (
    <NewProjectLayout>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Project</h1>
          <p className={styles.subtitle}>Fill out the form below to start a new project</p>
        </div>
        
        <div className={styles.formWrapper}>
          <FormComponent 
            fields={fields} 
            onSubmit={handleSubmit} 
            validateOnBlur={true}
            validateOnChange={true}
            className={styles.customForm}
          />
        </div>
      </div>
    </NewProjectLayout>
  );
};

export default NewProject;