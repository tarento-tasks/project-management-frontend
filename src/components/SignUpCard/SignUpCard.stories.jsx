import React from "react";
import SignUpCard from "./SignUpCard";


export default {
  title: "Components/SignUpCard",
  component: SignUpCard,
};

const Template = (args) => <SignUpCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectname: "Project 1",
  name: "John Doe",
  email: "johndoe@gmail.com",
  qualification: "B.Tech Computer Science",
  skills: "React, JavaScript, Bootstrap",
  previousWork: "Worked at XYZ Ltd.",
  onAccept: () => alert("Accepted!"),
  onReject: () => alert("Rejected!"),
};
