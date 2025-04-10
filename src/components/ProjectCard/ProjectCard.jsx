import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./projectcard.module.css";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import newProjectService from "../../services/newProjectService";
import Swal from "sweetalert2";
import axios from "axios";

const ProjectCard = ({ project, onUpdate, setParentShowModal }) => {
  const [showModal, setShowModal] = useState(false);
  const [editedProject, setEditedProject] = useState({...project});
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [currentMentor, setCurrentMentor] = useState(null);
  const [mentorLoading, setMentorLoading] = useState(false);

  // Initialize editedProject when project changes
  useEffect(() => {
    if (project) {
      setEditedProject({...project});
      // Fetch current mentor details when project changes
      if (project.mentorId) {
        fetchCurrentMentor(project.mentorId);
      }
    }
  }, [project]);

  // Update parent component's modal state
  useEffect(() => {
    if (setParentShowModal) {
      setParentShowModal(showModal);
    }
  }, [showModal, setParentShowModal]);

  // Fetch current mentor details
  const fetchCurrentMentor = async (mentorId) => {
    try {
      setMentorLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/users?userId=${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data?.response) {
        setCurrentMentor(response.data.response);
      }
    } catch (error) {
      console.error("Error fetching current mentor:", error);
    } finally {
      setMentorLoading(false);
    }
  };

  // Fetch all mentors when modal opens
  useEffect(() => {
    const fetchMentors = async () => {
      if (showModal) {
        try {
          setLoading(true);
          setApiError(null);
          
          // Fetch all mentors using the same endpoint as ProjectDetails
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:8080/api/users?role=MENTOR",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (response.data?.response) {
            setMentors(response.data.response);
          } else {
            setMentors([]);
          }
          
        } catch (err) {
          console.error("Failed to fetch mentors", err);
          setApiError('Failed to load mentors');
          setMentors([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMentors();
  }, [showModal]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await newProjectService.deleteProject(project.projectId);
        Swal.fire('Deleted!', 'Project has been deleted.', 'success');
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error("Failed to delete project", err);
      Swal.fire('Error', 'Failed to delete project', 'error');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      if (!editedProject.projectId) {
        throw new Error("Project ID is missing");
      }
      if (!editedProject.mentorId) {
        throw new Error("Please select a mentor");
      }

      await newProjectService.updateProject(editedProject.projectId, editedProject);
      setShowModal(false);
      Swal.fire("Success", "Project updated successfully", "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire(
        "Error", 
        `Failed to update project: ${err.message || 'Unknown error'}`,
        "error"
      );
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <>
      <Card className={styles.projectCard}>
        <Card.Body>
          <Card.Title className="text-center fw-bold" style={{ fontSize: "15px" }}>
            {project.title}
          </Card.Title>
          <Card.Text className="text-muted">{project.description}</Card.Text>

          <div className="d-flex justify-content-between mt-3" style={{ fontSize: "11px" }}>
            <div><strong>📅 Start:</strong> {project.lastDate || "N/A"}</div>
            <div><strong>⏳ End:</strong> {project.dueDate || "N/A"}</div>
          </div>
          
          <div className="d-flex justify-content-end mt-3 gap-2">
            <Button 
              size="sm" 
              variant="outline-primary" 
              onClick={handleEditClick}
            >
              <FaEdit />
            </Button>
            <Button 
              size="sm" 
              variant="outline-danger" 
              onClick={handleDelete}
            >
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        onClick={handleModalClick}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body onClick={handleModalClick}>
          {apiError && (
            <div className="alert alert-danger mb-3">
              {apiError}
            </div>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedProject.title || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editedProject.description || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Eligibility criteria</Form.Label>
              <Form.Control
                as="textarea"
                name="criteria"
                value={editedProject.criteria || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Objective</Form.Label>
              <Form.Control
                as="textarea"
                name="objective"
                value={editedProject.objective || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repository Link</Form.Label>
              <Form.Control
                type="text"
                name="repo"
                value={editedProject.repo || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="lastDate"
                value={editedProject.lastDate?.split('T')[0] || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={editedProject.dueDate?.split('T')[0] || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="openStatus"
                value={editedProject.openStatus ? "true" : "false"}
                onChange={(e) => {
                  setEditedProject(prev => ({
                    ...prev,
                    openStatus: e.target.value === "true"
                  }));
                }}
              >
                <option value="true">Open</option>
                <option value="false">Closed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Mentor</Form.Label>
  <Form.Select
    name="mentorId"
    value={editedProject.mentorId || ""}
    onChange={handleEditChange}
    disabled={loading}
    required
  >
    <option value="">Select a mentor</option>
    {mentors.map(mentor => (
      <option key={mentor.userId} value={mentor.userId}>
        {mentor.name || mentor.email}
      </option>
    ))}
  </Form.Select>
  {mentors.length === 0 && !loading && (
    <div className="text-danger mt-2">No mentors available</div>
  )}
</Form.Group>
           
  
          </Form>
        </Modal.Body>
        <Modal.Footer onClick={handleModalClick}>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSubmit}
            disabled={!editedProject.mentorId || loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    objective: PropTypes.string,
    lastDate: PropTypes.string,
    dueDate: PropTypes.string,
    repo: PropTypes.string,
    openStatus: PropTypes.bool,
    mentorId: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func,
  setParentShowModal: PropTypes.func
};

export default ProjectCard;