import React from "react";
import DashboardLayout from "./DashboardLayout";

export default {
  title: "Layouts/DashboardLayout",
  component: DashboardLayout,
};

const Template = (args) => <DashboardLayout {...args}>Dashboard Content</DashboardLayout>;

export const AdminView = Template.bind({});
AdminView.args = {
  role: "admin",
};

export const UserView = Template.bind({});
UserView.args = {
  role: "user",
};
