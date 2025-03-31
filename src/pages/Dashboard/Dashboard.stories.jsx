import React from "react";
import Dashboard from "./Dashboard";
import { BrowserRouter } from "react-router-dom";


export default {
  title: "Pages/Dashboard",
  component: Dashboard,
  argTypes: {
    userName: { control: "text" },
    role: { control: "radio", options: ["admin", "mentor", "student"] },
  },
};

const Template = (args) => (
  <BrowserRouter>
    <Dashboard {...args} />
  </BrowserRouter>
);

export const AdminDashboard = Template.bind({});
AdminDashboard.args = {
  role: "admin",
  userName: "Admin User",
};

export const MentorDashboard = Template.bind({});
MentorDashboard.args = {
  role: "mentor",
  userName: "Mentor User",
};

export const StudentDashboard = Template.bind({});
StudentDashboard.args = {
  role: "student",
  userName: "Student User",
};
