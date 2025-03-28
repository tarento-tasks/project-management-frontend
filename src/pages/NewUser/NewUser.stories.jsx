import React from 'react';
import NewUser from './NewUser';

export default {
  title: 'Pages/NewUser',
  component: NewProject,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <NewUser {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithSampleData = Template.bind({});
WithSampleData.args = {
  // Add any props if your component accepts them
};

WithSampleData.parameters = {
  docs: {
    description: {
      story: 'Example of the new project page with sample data loaded',
    },
  }
};