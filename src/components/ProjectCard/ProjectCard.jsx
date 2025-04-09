import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./projectcard.module.css";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import newProjectService from "../../services/newProjectService";
import Swal from "sweetalert2";

const ProjectCard = ({ project, onUpdate, setParentShowModal }) => {
  const [showModal, setShowModal] = useState(false);
  const [editedProject, setEditedProject] = useState({...project});
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Update parent component's modal state
  useEffect(() => {
    if (setParentShowModal) {
      setParentShowModal(showModal);
    }
  }, [showModal, setParentShowModal]);

  // Fetch mentors when modal opens
  useEffect(() => {
    const fetchMentors = async () => {
      if (showModal) {
        try {
          setLoading(true);
          setApiError(null);
          const response = await newProjectService.getMentors();
          // Ensure we always set an array, even if response is undefined
          setMentors(Array.isArray(response) ? response : []);
        } catch (err) {
          console.error("Failed to fetch mentors", err);
          setApiError('Failed to load mentors');
          setMentors([]); // Ensure mentors is always an array
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
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      // Validate required fields
      if (!editedProject.projectId) {
        throw new Error("Project ID is missing");
      }
      if (!editedProject.mentorId) {
        throw new Error("Please select a mentor");
      }

      console.log("Submitting project update:", editedProject);
      
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
            {/* ... (keep all your existing form fields) ... */}
            <Form.Group className="mb-2">
              <Form.Label>Mentor</Form.Label>
              <Form.Select
                name="mentorId"
                value={editedProject.mentorId || ""}
                onChange={handleEditChange}
                onClick={handleModalClick}
                disabled={loading}
                required
              >
                <option value="">Select a mentor</option>
                {loading ? (
                  <option>Loading mentors...</option>
                ) : (
                  mentors.map(mentor => (
                    <option key={mentor.userId} value={mentor.userId}>
                      {mentor.firstName} {mentor.lastName} ({mentor.email})
                    </option>
                  ))
                )}
              </Form.Select>
              {!loading && mentors.length === 0 && !apiError && (
                <div className="text-danger mt-1">
                  No mentors available
                </div>
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
    title: PropTypes.string,
    description: PropTypes.string,
    lastDate: PropTypes.string,
    dueDate: PropTypes.string,
    mentorId: PropTypes.string,
    // Add other required project props
  }).isRequired,
  onUpdate: PropTypes.func,
  setParentShowModal: PropTypes.func
};

export default ProjectCard;