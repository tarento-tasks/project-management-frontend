import React from "react";
import ProgressCard from "./ProgressCard";

export default {
  title: "Components/ProgressCard",
  component: ProgressCard,
};

const Template = (args) => <ProgressCard {...args} />;

export const AdminProgress = Template.bind({});
AdminProgress.args = {
  data: [
    { title: "Active Projects", value: 5 },
    { title: "Total Tasks", value: 20 },
    { title: "Completed Tasks", value: 12 },
  ],
};

export const MentorProgress = Template.bind({});
MentorProgress.args = {
  data: [
    { title: "Active Projects", value: 3 },
    { title: "Total Tasks", value: 15 },
    { title: "Completed Tasks", value: 10 },
  ],
};

export const StudentProgress = Template.bind({});
StudentProgress.args = {
  data: [
    { title: "Assigned Projects", value: 2 },
    { title: "Total Tasks", value: 10 },
    { title: "Completed Tasks", value: 5 },
  ],
};
