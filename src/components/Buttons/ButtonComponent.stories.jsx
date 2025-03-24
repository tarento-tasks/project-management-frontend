import React from "react";
import ButtonComponent from "./ButtonComponent";

export default {
  title: "Components/ButtonComponent",
  component: ButtonComponent,
  argTypes: {
    variant: {
      control: { type: "select", options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"] },
    },
    size: {
      control: { type: "select", options: ["sm", "md", "lg"] },
    },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
  },
};

const Template = (args) => <ButtonComponent {...args}>Click Me</ButtonComponent>;

export const Default = Template.bind({});
Default.args = {
  variant: "primary",
  size: "md",
  disabled: false,
  isLoading: false,
};
