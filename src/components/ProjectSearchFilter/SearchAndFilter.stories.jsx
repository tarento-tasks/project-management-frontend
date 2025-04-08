import React from 'react';
import SearchAndFilter from './SearchAndFilter';

export default {
  title: 'Components/SearchAndFilter',
  component: SearchAndFilter,
};

const Template = (args) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterOption, setFilterOption] = React.useState('all');
  const [skillFilter, setSkillFilter] = React.useState('');
  
  return (
    <SearchAndFilter
      {...args}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterOption={filterOption}
      onFilterChange={setFilterOption}
      skillFilter={skillFilter}
      onSkillChange={setSkillFilter}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  allSkills: ['React', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design']
};

export const NoSkills = Template.bind({});
NoSkills.args = {
  allSkills: []
};

export const CustomFilterOptions = Template.bind({});
CustomFilterOptions.args = {
  allSkills: ['JavaScript', 'TypeScript'],
  filterOptions: [
    { value: 'all', label: 'Show All' },
    { value: 'frontend', label: 'Frontend Only' },
    { value: 'backend', label: 'Backend Only' }
  ]
};