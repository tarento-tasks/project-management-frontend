import React from 'react';
import Modal from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    onClose: { action: 'closed' },
  },
};

const Template = (args) => <Modal {...args} />;

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  title: 'Modal Title',
  children: (
    <div>
      <p>This is the modal content. You can put any React components here.</p>
      <p>For example: forms, alerts, confirmation messages, etc.</p>
    </div>
  ),
};

export const WithForm = Template.bind({});
WithForm.args = {
  isOpen: true,
  title: 'Submit Form',
  children: (
    <form>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Name</label>
        <input type="text" style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
        <input type="email" style={{ width: '100%', padding: '8px' }} />
      </div>
    </form>
  ),
};