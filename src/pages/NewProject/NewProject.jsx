import React, { useEffect, useState } from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from 'sweetalert2';
import styles from "./newProject.module.css";
import newProjectService from '../../services/newProjectService'; 

const NewProject = () => {
  const [skills, setSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📌 Fetching skills & mentors...");

    const fetchData = async () => {
      try {
        const [skillsResponse, mentorsResponse] = await Promise.all([
          newProjectService.getAllSkills(),  // ✅ Use newProjectService
          newProjectService.getMentors()     // ✅ Use newProjectService
        ]);

        console.log("✅ Skills fetched:", skillsResponse);
        console.log("✅ Mentors fetched:", mentorsResponse);

        
        
        console.log("Type of skillsResponse.response:", typeof skillsResponse.response);
        console.log("Is skillsResponse.response an array?", Array.isArray(skillsResponse.response));

        setSkills(skillsResponse.response.map(skill => skill.skillName));
        setMentors(mentorsResponse.response.map(mentor => ({
          userId: mentor.userId,
          name: mentor.name
        })));

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError('Failed to fetch required data');
        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load required data. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#517ea6'
        });
      }
    };

    fetchData();
  }, []);

  const fields = [
    { name: "title", label: "Project Title", type: "text", placeholder: "Enter project title", required: true },
    { name: "objective", label: "Objective", type: "text", placeholder: "Enter project objective", required: true },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter detailed description", rows: 5, required: true },
    { name: "criteria", label: "Eligibility Criteria", type: "textarea", placeholder: "Enter eligibility requirements", rows: 3, required: true },
    { name: "skills", label: "Skills Required", type: "select", options: skills, required: true },
    {
      name: "repo",
      label: "Repository Link",
      type: "url",
      required: true,
      validation: { maxLength: 255 }
    },
    { name: "mentor", label: "Mentor", type: "select", options: mentors.map(m => m.name), required: true },
    {
      name: "lastDate",
      label: "Last Date to Enroll",
      type: "date",
      required: true,
      validation: {
        custom: true
        
      }
    },
    {
      name: "dueDate",
      label: "Project Due Date",
      type: "date",
      required: true,
      validation: {
        custom: true
        
      }
    }
  ];

  const handleSubmit = async (formData) => {
    try {
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

      const selectedMentor = mentors.find(mentor => mentor.name === formData.mentor);
      if (!selectedMentor) {
        throw new Error('Selected mentor not found');
      }

      const projectData = {
        title: formData.title,
        objective: formData.objective,
        description: formData.description,
        criteria: formData.criteria,
        repo: formData.repo,
        skills: formData.skills,
        mentorId: selectedMentor.userId,
        lastDate: formData.lastDate,
        dueDate: formData.dueDate,
        openStatus: true
      };

      console.log("📌 Sending project data to API:", projectData);

      const response = await newProjectService.createProject(projectData); // ✅ Use newProjectService
      console.log("✅ Project Created:", response);

      Swal.fire({
        title: 'Success!',
        text: 'Project created successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#517ea6',
        timer: 1000,
        willClose: () => {
          // Reload the page after the success message closes
          window.location.reload();
        }
      });

    } catch (error) {
      console.error('❌ Error creating project:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create project',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#517ea6'
      });
    }
  };

  if (loading) {
    return (
      <NewProjectLayout>
        <div className={styles.pageContainer}>
          <h1>Create New Project</h1>
          <p>Loading required data...</p>
        </div>
      </NewProjectLayout>
    );
  }

  if (error) {
    return (
      <NewProjectLayout>
        <div className={styles.pageContainer}>
          <h1>Create New Project</h1>
          <p>{error}</p>
        </div>
      </NewProjectLayout>
    );
  }

  return (
    <NewProjectLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Create New Project</h1>
        
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