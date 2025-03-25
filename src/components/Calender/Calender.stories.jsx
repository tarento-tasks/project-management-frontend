import React from "react";
import Calender from "./Calender";

export default {
  title: "Components/Calendar",
  component: Calender,
};

const Template = (args) => <Calender {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectDeadline: "2025-04-10", // Example deadline
};
