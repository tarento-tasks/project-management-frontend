// components/Header/Header.stories.jsx
import React from "react";
import Header from "./Header";

export default {
  title: "Components/Header",
  component: Header,
};

const Template = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  userName: "Alex Meian",
  userRole: "Product Manager",
};

export const CustomUser = Template.bind({});
CustomUser.args = {
  userName: "John Doe",
  userRole: "Software Engineer",
};
