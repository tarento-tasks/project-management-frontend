import React from 'react';
import Calendar from './Calendar';

export default {
  title: 'Components/Calendar',
  component: Calendar,
};

const Template = (args) => <Calendar {...args} />;

export const Default = Template.bind({});
Default.args = {
  upcomingDates: [
    {
      name: "Website Redesign",
      dueDate: new Date(2025, 2, 15),
      
    },
    {
      name: "API Integration",
      dueDate: new Date(2025, 2, 20),
      
    },
    {
      name: "Database Migration",
      dueDate: new Date(2025, 2, 28),
      
    }
  ],
};