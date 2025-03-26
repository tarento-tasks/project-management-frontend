import React, { useState } from "react";
import styles from "./createtask.module.css";
import { Form, Button } from "react-bootstrap";

const CreateTask = ({ students, onSubmit }) => {
  const [formData, setFormData] = useState({
    task: "",
    objective: "",
    student: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.createTaskContainer}>
      <h2 className={styles.title}>Create Task</h2>
      <Form onSubmit={handleSubmit} className={styles.form}>
        {/* Task Input */}
        <Form.Group>
          <Form.Label className={styles.label}>Task</Form.Label>
          <Form.Control
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="Enter task"
            required
          />
        </Form.Group>

        {/* Objective Input */}
        <Form.Group>
          <Form.Label className={styles.label}>Objective</Form.Label>
          <Form.Control
            as="textarea"
            name="objective"
            rows={3}
            value={formData.objective}
            onChange={handleChange}
            placeholder="Enter objective"
            required
          />
        </Form.Group>

        {/* Student Dropdown */}
        <Form.Group>
          <Form.Label className={styles.label}>Add Student</Form.Label>
          <Form.Control
            as="select"
            name="student"
            value={formData.student}
            onChange={handleChange}
            required
          >
            <option value="">Select a student</option>
            {students.map((student, index) => (
              <option key={index} value={student}>
                {student}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Due Date Picker */}
        <Form.Group>
          <Form.Label className={styles.label}>Due Date</Form.Label>
          <Form.Control
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" className={styles.addTaskButton}>
          Add Task
        </Button>
      </Form>
    </div>
  );
};

export default CreateTask;
