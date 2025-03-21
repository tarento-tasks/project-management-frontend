import React from "react";
import CardComponent from "./CardComponent";

export default {
  title: "Components/CardComponent",
  component: CardComponent,
  argTypes: {
    statusColor: {
      control: { type: "select", options: ["green", "orange", "red"] },
    },
  },
};

const Template = (args) => <CardComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Project Status",
  fields: [
    { key: "name", label: "Project Name" },
    { key: "mentor", label: "Mentor" },
    { key: "status", label: "Status" },
  ],
  data: [
    { name: "Project A", mentor: "John Doe", status: "Approved" }, // ✅ Use lowercase
    { name: "Project B", mentor: "Jane Doe", status: "Pending" },
    { name: "Project C", mentor: "Alice Smith", status: "Rejected" },
  ],
};

