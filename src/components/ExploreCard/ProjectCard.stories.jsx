// components/ProjectCard/ProjectCard.stories.jsx
import ProjectCard from './ProjectCard';

export default {
  title: 'Components/ProjectCard',
  component: ProjectCard,
};

const sampleProject = {
  projectId: '1',
  title: 'AI Chatbot Development',
  description: 'Develop a chatbot using natural language processing to assist students with academic queries.',
  objective: 'To create an intelligent assistant for student queries',
  criteria: 'Computer Science students with NLP knowledge',
  skillsRequired: 'Python, NLP, Machine Learning',
  dueDate: '2023-12-31',
  lastDate: '2023-11-15',
};

const Template = (args) => <ProjectCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  project: sampleProject,
  isRecommended: true,
  onEnroll: (id) => console.log(`Enrolling in project ${id}`),
};

export const NotRecommended = Template.bind({});
NotRecommended.args = {
  project: sampleProject,
  isRecommended: false,
  onEnroll: (id) => console.log(`Enrolling in project ${id}`),
};