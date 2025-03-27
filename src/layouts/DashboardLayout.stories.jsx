import React from "react";
import DashboardLayout from "./DashboardLayout";

export default {
  title: "Layouts/DashboardLayout",
  component: DashboardLayout,
  argTypes: {
    userName: { control: "text" },
    userRole: {
        control: "select", // Use "select" (not an object)
        options: ["admin", "mentor", "student"], // Ensure lowercase matches Sidebar
      },
  },
};

const Template = (args) => {
    console.log("Storybook Args:", args); // Debugging: Check if userRole is passed correctly
    return (
      <DashboardLayout {...args}>
        <div style={{ padding: "20px", background: "#f8f9fa" }}>
          <h3>Dashboard Content</h3>
          <p>This is a sample dashboard page for preview.</p>
        </div>
      </DashboardLayout>
    );
  };

export const AdminDashboard = Template.bind({});
AdminDashboard.args = {
  userName: "John Doe",
  userRole: "Admin",
};

export const MentorDashboard = Template.bind({});
MentorDashboard.args = {
  userName: "Alice Smith",
  userRole: "Mentor",
};

export const StudentDashboard = Template.bind({});
StudentDashboard.args = {
  userName: "Bob Johnson",
  userRole: "Student",
};
