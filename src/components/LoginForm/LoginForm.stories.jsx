import React from 'react';
import LoginForm from './LoginForm';

export default {
  title: 'Components/LoginForm',
  component: LoginForm,
};

const Template = (args) => <LoginForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onLogin: (data) => console.log('Login Data:', data),
};
