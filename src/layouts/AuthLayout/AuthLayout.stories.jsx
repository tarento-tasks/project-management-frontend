import React from 'react';
import AuthLayout from './AuthLayout';

export default {
  title: 'Layouts/AuthLayout',
  component: AuthLayout,
};

const Template = (args) => (
  <AuthLayout {...args}>
    <div style={{ padding: '2rem', border: '1px dashed #ccc', textAlign: 'center' }}>
      Content goes here
    </div>
  </AuthLayout>
);

export const Default = Template.bind({});
Default.args = {};