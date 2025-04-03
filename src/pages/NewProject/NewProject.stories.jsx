import React from 'react';
import NewProject from './NewProject';

export default {
  title: 'Pages/NewProject',
  component: NewProject,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <NewProject {...args} />;

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