import React from "react";
import CalendarComponent from "./Calendar"; // Ensure this path matches the file structure

export default {
  title: "Components/Calendar",
  component: CalendarComponent, // Use the correct component name
};

const Template = (args) => <CalendarComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectDeadline: "2025-04-10", // Example deadline
};
