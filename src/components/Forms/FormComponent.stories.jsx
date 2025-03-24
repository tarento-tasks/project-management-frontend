import React from "react";
import FormComponent from "./FormComponent";

export default {
  title: "Components/FormComponent",
  component: FormComponent,
};

const skills = ["React", "Spring Boot", "Java", "Python"];
const mentors = ["John Doe", "Jane Doe", "Alice Smith"];

const Template = (args) => <FormComponent {...args} />;

export const ProjectForm = Template.bind({});
ProjectForm.args = {
  fields: [
    { name: "title", label: "Project Title", type: "text", placeholder: "Enter project title" },
    { name: "objective", label: "Objective", type: "text", placeholder: "Enter objective" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter description" },
    { name: "criteria", label: "Criteria", type: "text", placeholder: "Enter criteria" },
    { name: "dueDate", label: "Due Date", type: "date" },
    { name: "lastDate", label: "Last Date", type: "date" },
    { name: "skills", label: "Skills", type: "select", options: skills },
    { name: "mentor", label: "Mentor", type: "select", options: mentors },
  ],
  onSubmit: (data) => console.log("Form Submitted:", data),
};
