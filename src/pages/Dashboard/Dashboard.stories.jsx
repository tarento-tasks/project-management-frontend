import React from "react";
import Dashboard from "./Dashboard"; // Correct path to the Dashboard component
import { withKnobs, text } from "@storybook/addon-knobs"; // Knobs to dynamically update props
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

// Sample data for the user role
const userName = "John Doe";

export default {
  title: "Pages/Dashboard", // Organizing the Storybook in a 'Pages' section
  component: Dashboard,
  decorators: [withKnobs], // Enable knobs for dynamic updates in Storybook
};

export const AdminDashboard = () => {
  return (
    <BrowserRouter>
      <Dashboard
        role="admin"
        userName={text("User Name", userName)} // Allow user to edit userName dynamically
      />
    </BrowserRouter>
  );
};

export const MentorDashboard = () => {
  return (
    <BrowserRouter>
      <Dashboard
        role="mentor"
        userName={text("User Name", userName)}
      />
    </BrowserRouter>
  );
};

export const StudentDashboard = () => {
  return (
    <BrowserRouter>
      <Dashboard
        role="student"
        userName={text("User Name", userName)}
      />
    </BrowserRouter>
  );
};