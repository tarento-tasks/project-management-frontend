import React from "react";
import CardComponent from "./CardComponent";

export default {
  title: "Components/CardComponent",
  component: CardComponent,
  argTypes: {},
};

const Template = (args) => <CardComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "User List",
  fields: [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    { key: "role", label: "Role" },
  ],
  data: [
    { name: "John Doe", status: "Approved", role: "Mentor" },
    { name: "Jane Smith", status: "Pending", role: "Student" },
    { name: "Alice Johnson", status: "Rejected", role: "Admin" },
  ],
};

export const TaskDetails = Template.bind({});
TaskDetails.args = {
  title: "Task Details",
  fields: [
    { key: "taskName", label: "Task Name" },
    { key: "status", label: "Status" },
  ],
  data: [
    { taskName: "Task 1", status: "Approved" },
    { taskName: "Task 2", status: "Pending" },
    { taskName: "Task 3", status: "Rejected" },
  ],
};

export const EmptyData = Template.bind({});
EmptyData.args = {
  title: "No Data Example",
  fields: [
    { key: "column1", label: "Column 1" },
    { key: "column2", label: "Column 2" },
  ],
  data: [],
};
