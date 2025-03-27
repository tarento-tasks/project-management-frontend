import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar"; // Make sure the path is correct

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

export const Admin = Template.bind({});
Admin.args = {
  role: "admin",
};

export const Mentor = Template.bind({});
Mentor.args = {
  role: "mentor",
};

export const Student = Template.bind({});
Student.args = {
  role: "student",
};