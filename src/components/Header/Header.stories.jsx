import React from "react";
import Header from "./Header";

export default {
  title: "Components/Header",
  component: Header,
  argTypes: {
    userName: { control: "text" },
    userRole: { control: "text" },
  },
};

const Template = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  userName: "Enter name here",
  userRole: "Enter role here",
};
