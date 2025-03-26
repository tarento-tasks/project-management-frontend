import React from "react";
import CreateTask from "./CreateTask";

export default {
  title: "Components/CreateTask",
  component: CreateTask,
  argTypes: {
    students: { control: "array" },
    onSubmit: { action: "submitted" },
  },
};

const Template = (args) => <CreateTask {...args} />;

export const Default = Template.bind({});
Default.args = {
  students: ["Alice", "Bob", "Charlie"],
};
