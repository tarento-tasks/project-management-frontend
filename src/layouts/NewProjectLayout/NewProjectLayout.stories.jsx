import React from 'react';
import NewProjectLayout from './NewProjectLayout';

export default {
  title: 'Layouts/NewProjectLayout',
  component: NewProjectLayout,
};

const Template = (args) => (
  <NewProjectLayout {...args}>
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <h2>Content Area</h2>
      <p>This is where the page content will appear</p>
    </div>
  </NewProjectLayout>
);

export const Default = Template.bind({});
Default.args = {
  role: 'admin',
  userName: 'Admin User',
  userRole: 'Administrator'
};