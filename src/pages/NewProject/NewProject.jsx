import React, { useEffect, useState } from 'react';
import FormComponent from "../../components/Forms/FormComponent";
import NewProjectLayout from "../../layouts/NewProjectLayout/NewProjectLayout";
import Swal from 'sweetalert2';
import styles from "./newProject.module.css";
import API from '../../services/api'; // ✅ Correct import

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
          API.getAllSkills(),  // ✅ Use API.getAllSkills()
          API.getMentors()     // ✅ Use API.getMentors()
        ]);

        console.log("✅ Skills fetched:", skillsResponse);
        console.log("✅ Mentors fetched:", mentorsResponse);

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
    { name: "criteria", label: "Eligibility Criteria", type: "textarea", placeholder: "Enter eligibility requirements", rows: 3 ,required: true},
    { name: "skills", label: "Skills Required", type: "select", options: skills, required: true },
    {
      name: "repo",
      label: "Repository Link",
      type: "url",  // Added field for the repository link
      required: true,
      validation: { maxLength: 255 }
    },
    {
    name: "mentor", 
    label: "Mentor", 
    type: "select", 
    options: mentors.map(m => ({ value: m.userId, label: m.name })), // Changed to object with value and label
    required: true 
  },
    { name: "lastDate", label: "Last Date to Enroll", type: "date", required: true },
    { name: "dueDate", label: "Project Due Date", type: "date", required: true }
  ];

  const handleSubmit = async (formData) => {
    try {
      // Validate dates
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
  
      // 1. First create the project
      const projectData = {
        title: formData.title,
        objective: formData.objective,
        description: formData.description,
        criteria: formData.criteria,
        repo: formData.repo,
        skills: formData.skills, // Array of skill names
        mentorId: formData.mentor, // userId from the select
        lastDate: formData.lastDate,
        dueDate: formData.dueDate,
        openStatus: true
      };
  
      console.log("📌 Creating project:", projectData);
      const projectResponse = await API.createProject(projectData);
      console.log("✅ Project created:", projectResponse);
      
      // Get the created project ID from the response
      const projectId = projectResponse.response.projectId; // Adjust if the structure is different
  
      // 2. Map skills to the project
      if (formData.skills && formData.skills.length > 0) {
        // Get all skills to match names with IDs
        const skillsResponse = await API.getAllSkills();
        const allSkills = skillsResponse.response;
  
        // Map each selected skill to the project
        const skillMappingPromises = formData.skills.map(async (skillName) => {
          const skill = allSkills.find(s => s.skillName === skillName);
          if (skill) {
            try {
              const mappingResponse = await API.mapSkillToProject({
                projectId: projectId,
                skillId: skill.skillId
              });
              console.log(`✅ Skill "${skillName}" mapped:`, mappingResponse);
              return mappingResponse;
            } catch (error) {
              console.error(`❌ Error mapping skill "${skillName}":`, error);
              return null;
            }
          }
          return null;
        });
  
        // Wait for all mappings to complete
        await Promise.all(skillMappingPromises);
      }
  
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Project created and skills mapped successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#517ea6',
        timer: 2000,
      });
  
      // Optional: Redirect to projects page after creation
      // history.push('/projects');
  
    } catch (error) {
      console.error('❌ Error in project creation:', error);
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