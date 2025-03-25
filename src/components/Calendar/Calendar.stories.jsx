import React from "react";
import Calendar from "./Calendar";

export default {
  title: "Components/Calendar",
  component: Calendar,
};

const Template = (args) => <Calendar {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectDeadline: "2025-04-10", // Example deadline
};
