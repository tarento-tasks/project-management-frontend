import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../layouts/GeneralLayout";
import styles from "./projectDetails.module.css";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCalendar, FiUser, FiInfo, FiLink, FiClock, FiCheck, FiAward } from "react-icons/fi";

Modal.setAppElement('#root');

const API_URL = "http://localhost:8080/api/projects";
const USERS_API = "http://localhost:8080/api/users";
const ENROLLMENT_API = "http://localhost:8080/api/project-enrollment/approved-students";
const TASKS_API = "http://localhost:8080/api/tasks";
const STU_TASK_API = "http://localhost:8080/api/stu-task";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [mentorName, setMentorName] = useState("Loading...");
  const [mentorImage, setMentorImage] = useState(null);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [taskStudentsMap, setTaskStudentsMap] = useState({});
  const [studentImages, setStudentImages] = useState({}); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: '',
    taskObjective: '',
    dueDate: '',
    assignedStudents: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const fetchUserRole = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUserRole(parsedUser.role?.toLowerCase());
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    };

    fetchUserRole();
    
    if (projectId) {
      fetchProjectDetails();
      fetchApprovedStudents(projectId);
      fetchTasksForProject(projectId);
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}?id=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const projectData = response.data.response[0];
      setProject(projectData);

      if (projectData.mentorId) {
        fetchMentorDetails(projectData.mentorId);
      } else {
        setMentorName("Not Assigned");
        setMentorImage(null);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorDetails = async (mentorId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${USERS_API}?userId=${mentorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data?.response) {
        const mentorData = response.data.response;
        setMentorName(mentorData.name || "Unknown Mentor");
        setMentorImage(mentorData.imageBase64 || null);
      } else {
        setMentorName("Unknown Mentor");
        setMentorImage(null);
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
      setMentorName("Unknown Mentor");
      setMentorImage(null);
    }
  };

  const fetchApprovedStudents = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ENROLLMENT_API}?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const students = response.data.response || [];
      setApprovedStudents(students);
      
      // Fetch profile pictures for all students
      const images = {};
      await Promise.all(
        students.map(async (student) => {
          try {
            const userRes = await axios.get(`${USERS_API}?userId=${student.userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (userRes.data?.response?.imageBase64) {
              images[student.userId] = userRes.data.response.imageBase64;
            }
          } catch (err) {
            console.error(`Error fetching image for student ${student.userId}:`, err);
          }
        })
      );
      setStudentImages(images);
    } catch (err) {
      console.error("Error fetching approved students:", err);
      setApprovedStudents([]);
    }
  };
  
  
  const fetchStudentsForTasks = async (tasks) => {
    const token = localStorage.getItem("token");
    const newMap = {};
  
    await Promise.all(
      tasks.map(async (task) => {
        try {
          const res = await axios.get(`${STU_TASK_API}?taskId=${task.taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (res.data?.response) {
            const enriched = await Promise.all(
              res.data.response.map(async (s) => {
                try {
                  const userRes = await axios.get(`${USERS_API}?userId=${s.studentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  return {
                    ...s,
                    name: userRes.data?.response?.name || s.studentId,
                    image: userRes.data?.response?.imageBase64 || null
                  };
                } catch (err) {
                  console.error(`Error fetching user ${s.studentId}:`, err);
                  return {
                    ...s,
                    name: s.studentId,
                    image: null
                  };
                }
              })
            );
            newMap[task.taskId] = enriched;
          } else {
            newMap[task.taskId] = [];
          }
        } catch (err) {
          console.error(`Error fetching students for task ${task.taskId}:`, err);
          newMap[task.taskId] = [];
        }
      })
    );
  
    setTaskStudentsMap(newMap);
  };

  const fetchStudentName = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${USERS_API}?user_id=${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const users = res.data;
      const matchedUser = Array.isArray(users)
        ? users.find((user) => user.userId === studentId)
        : null;
  
      return matchedUser?.name || studentId;
    } catch (err) {
      console.error(`Failed to fetch name for ${studentId}`, err);
      return studentId;
    }
  };

  const fetchTasksForProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${TASKS_API}?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.response) {
        const fetchedTasks = response.data.response;
        setTasks(fetchedTasks);
        fetchStudentsForTasks(fetchedTasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const openCreateTaskModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setNewTask({
      taskName: '',
      taskObjective: '',
      dueDate: '',
      assignedStudents: []
    });
  };

  const openEditTaskModal = (task) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setCurrentTaskId(task.taskId);
    setNewTask({
      taskName: task.taskName,
      taskObjective: task.taskObjective || '',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '',
      assignedStudents: taskStudentsMap[task.taskId]?.map(s => s.studentId) || []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (e) => {
    const options = e.target.options;
    const selectedStudents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedStudents.push(options[i].value);
      }
    }
    setNewTask(prev => ({ ...prev, assignedStudents: selectedStudents }));
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 3000,
      showConfirmButton: false,
      background: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.1)'
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      background: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.1)'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      if (isEditing) {
        await axios.put(`${TASKS_API}/${currentTaskId}`, {
          taskName: newTask.taskName,
          taskObjective: newTask.taskObjective,
          dueDate: newTask.dueDate,
          projectId: projectId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        showSuccessAlert('Task updated successfully!');
      } else {
        const response = await axios.post(TASKS_API, {
          taskName: newTask.taskName,
          taskObjective: newTask.taskObjective,
          dueDate: newTask.dueDate,
          projectId: projectId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const createdTask = response.data?.response || response.data;
        
        if (!createdTask || !createdTask.taskId) {
          throw new Error('Invalid task creation response');
        }

        if (newTask.assignedStudents.length > 0) {
          try {
            await Promise.all(newTask.assignedStudents.map(studentId => 
              axios.post(STU_TASK_API, {
                taskId: createdTask.taskId,
                studentId: studentId
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })
            ));
          } catch (assignmentError) {
            console.error("Error assigning students:", assignmentError);
            showErrorAlert('Task was created but student assignment failed');
          }
        }

        showSuccessAlert('Task created successfully!');
      }

      await fetchTasksForProject(projectId);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving task:", err);
      showErrorAlert(err.response?.data?.message || 'Failed to save task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.1)'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${TASKS_API}/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        await fetchTasksForProject(projectId);
        showSuccessAlert('Task has been deleted.');
      } catch (err) {
        console.error("Error deleting task:", err);
        showErrorAlert('Failed to delete task. Please try again.');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "Completed") return `${styles.statusBadge} ${styles.completed}`;
    if (status === "Pending") return `${styles.statusBadge} ${styles.pending}`;
    return `${styles.statusBadge} ${styles.notMarked}`;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) return <div className={styles.loading}>Loading project...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!project) return <div className={styles.noData}>No project found.</div>;

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.heading}>{project.title}</h1>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3><FiInfo /> Project Details</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Objective:</span>
              <span className={styles.infoValue}>{project.objective}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Description:</span>
              <span className={styles.infoValue}>{project.description}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Repository:</span>
              <span className={styles.infoValue}>
                <a href={project.repo} target="_blank" rel="noopener noreferrer">
                  {project.repo}
                </a>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Start Date:</span>
              <span className={styles.infoValue}>{project.lastDate}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Due Date:</span>
              <span className={styles.infoValue}>{project.dueDate}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Criteria:</span>
              <span className={styles.infoValue}>{project.criteria}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={styles.infoValue}>
                {project.openStatus ? (
                  <span className={getStatusBadgeClass("Pending")}>Open</span>
                ) : (
                  <span className={getStatusBadgeClass("Completed")}>Closed</span>
                )}
              </span>
            </div>
            <div className={styles.infoItem}>
  <span className={styles.infoLabel}>Mentor:</span>
  <span className={styles.infoValue}>
    {mentorImage ? (
      <div className={styles.mentorDisplay}>
        <img 
          src={`data:image/jpeg;base64,${mentorImage}`} 
          alt={mentorName}
          className={styles.mentorAvatar}
        />
        <span>{mentorName}</span>
      </div>
    ) : (
      <div className={styles.mentorDisplay}>
        <div className={styles.avatarSmall}>
          {getInitials(mentorName)}
        </div>
        <span>{mentorName}</span>
      </div>
    )}
  </span>
</div>
          </div>

          <div className={styles.infoCard}>
            <h3><FiUser /> Team Members</h3>
            {approvedStudents.length > 0 ? (
              <ul className={styles.teamList}>
                {approvedStudents.map((student) => (
                  <li key={student.userId} className={styles.teamMember}>
                    <div className={styles.avatar}>
                      {getInitials(student.name)}
                    </div>
                    <div className={styles.memberInfo}>
                      <div className={styles.memberName}>{student.name}</div>
                      <div className={styles.memberEmail}>{student.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No approved students.</p>
            )}
          </div>
        </div>

        <div className={styles.taskSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Project Tasks</h3>
            {(userRole === "admin" || userRole === "mentor") && (
              <button 
                onClick={openCreateTaskModal}
                className={styles.createButton}
              >
                <FiPlus /> Create New Task
              </button>
            )}
          </div>

          {tasks.length > 0 ? (
            <table className={styles.taskTable}>
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Objective</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Student Assigned</th>
                  {(userRole === "admin" || userRole === "mentor") && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.taskName}</td>
                    <td>{task.taskObjective || "N/A"}</td>
                    <td>
                      {task.dueDate ? (
                        <>
                          <FiCalendar /> {new Date(task.dueDate).toLocaleDateString()}
                        </>
                      ) : "Not set"}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(task.completeStatus)}>
                        {task.completeStatus || "Not marked"}
                      </span>
                    </td>
                    <td>
  {taskStudentsMap[task.taskId] && taskStudentsMap[task.taskId].length > 0 ? (
    <div className={styles.assignedStudents}>
      {taskStudentsMap[task.taskId].map((student, index) => (
        <div key={index} className={styles.studentBadge}>
          {student.image ? (
            <img 
              src={`data:image/jpeg;base64,${student.image}`} 
              alt={student.name}
              className={styles.studentAvatar}
            />
          ) : (
            <div className={styles.avatarSmall}>
              {getInitials(student.name)}
            </div>
          )}
          <span>{student.name}</span>
        </div>
      ))}
    </div>
  ) : (
    <span>No students assigned</span>
  )}
</td>
                    {(userRole === "admin" || userRole === "mentor") && (
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            onClick={() => openEditTaskModal(task)}
                            className={styles.actionButton}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.taskId)}
                            className={`${styles.actionButton} ${styles.delete}`}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.infoCard}>
              <p>No tasks assigned yet.</p>
            </div>
          )}
        </div>

        {/* Modern Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className={styles.modal}
          overlayClassName={styles.overlay}
          contentLabel={isEditing ? "Edit Task" : "Create Task"}
        >
          <div className={styles.modalHeader}>
            <h2>
              {isEditing ? (
                <>
                  <FiEdit2 /> Edit Task
                </>
              ) : (
                <>
                  <FiPlus /> Create New Task
                </>
              )}
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className={styles.modalCloseButton}
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formGroup}>
              <label>Task Name *</label>
              <input
                type="text"
                name="taskName"
                value={newTask.taskName}
                onChange={handleInputChange}
                required
                className={styles.formInput}
                placeholder="Enter task name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Objective</label>
              <textarea
                name="taskObjective"
                value={newTask.taskObjective}
                onChange={handleInputChange}
                className={styles.formTextarea}
                placeholder="Describe the task objective"
                rows="4"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiCalendar /> Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            {approvedStudents.length > 0 && (
              <div className={styles.formGroup}>
                <label>
                  <FiUser /> Assign Students
                </label>
                <select
                  multiple
                  value={newTask.assignedStudents}
                  onChange={handleStudentSelect}
                  className={styles.formSelect}
                >
                  {approvedStudents.map(student => (
                    <option key={student.userId} value={student.userId}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
                <small className={styles.helperText}>Hold Ctrl/Cmd to select multiple students</small>
              </div>
            )}

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                {isEditing ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;