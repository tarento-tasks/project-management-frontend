import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

export default {
  title: "Components/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template = (args) => <Sidebar {...args} />;

export const AdminSidebar = Template.bind({});
AdminSidebar.args = {
  role: "admin",
};

export const MentorSidebar = Template.bind({});
MentorSidebar.args = {
  role: "mentor",
};

export const StudentSidebar = Template.bind({});
StudentSidebar.args = {
  role: "student",
};
