import React from "react";
import LogoDisplay from "./LogoDisplay";

export default {
  title: "Components/LogoDisplay",
  component: LogoDisplay,
};

const Template = (args) => <LogoDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {};
