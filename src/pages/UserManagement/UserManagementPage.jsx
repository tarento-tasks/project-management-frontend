import React, { useState, useEffect } from 'react';
import GeneralLayout from '../../layouts/GeneralLayout';
import UserTable from '../../components/UserManagement/UserTable';
import UserModal from '../../components/UserManagement/UserModal';
import styles from './userManagementPage.module.css';
import { useRecoilValue } from 'recoil';
import { authState } from '../../states/authState';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { FaUserGraduate, FaChalkboardTeacher, FaPlus } from 'react-icons/fa';

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState('mentors');
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (auth.role !== 'ADMIN') {
      navigate('/unauthorized');
    }
  }, [auth, navigate]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [rolesData, mentorsData, studentsData] = await Promise.all([
          UserService.getRoles(),
          UserService.getUsers({ role: 'MENTOR' }),
          UserService.getUsers({ role: 'STUDENT' })
        ]);
        
        setRoles(rolesData);
        setMentors(mentorsData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load data',
          icon: 'error',
          confirmButtonColor: '#517ea6',
          background: '#2d455f',
          color: '#fff'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

 
  const handleCreateNew = () => {
    setSelectedUser({
      userId: '',
      name: '',
      email: '',
      password: '',
      dob: '',
      previousWork: '',
      qualifications: '',
      roleId: ''
    });
    setIsCreateMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsCreateMode(false);
  };

  const handleSave = async (updatedUser) => {
    try {
      const userData = {
        userId: updatedUser.userId,
        email: updatedUser.email,
        name: updatedUser.name,
        password: updatedUser.password,
        dob: updatedUser.dob,
        image: updatedUser.imageFile,
        previousWork: updatedUser.previousWork || '',
        qualifications: updatedUser.qualifications || '',
        roleId: updatedUser.roleId
      };

      const response = await UserService.saveUser(userData);
      
      if (isCreateMode) {
        // Add new user to appropriate list
        const newUser = response;
        const role = roles.find(r => r.roleId === newUser.roleId)?.roleName;
        if (role === 'MENTOR') {
          setMentors([...mentors, newUser]);
        } else if (role === 'STUDENT') {
          setStudents([...students, newUser]);
        }
      } else {
        // Update existing user
        if (activeTab === 'mentors') {
          setMentors(mentors.map(mentor => 
            mentor.userId === updatedUser.userId ? { ...mentor, ...response } : mentor
          ));
        } else {
          setStudents(students.map(student => 
            student.userId === updatedUser.userId ? { ...student, ...response } : student
          ));
        }
      }
      
      setIsModalOpen(false);
      
      Swal.fire({
        title: 'Success!',
        text: isCreateMode ? 'User created successfully' : 'User updated successfully',
        icon: 'success',
        confirmButtonColor: '#517ea6',
        background: '#2d455f',
        color: '#fff'
      });
    } catch (error) {
      console.error('Save failed:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save user data',
        icon: 'error',
        confirmButtonColor: '#517ea6',
        background: '#2d455f',
        color: '#fff'
      });
    }
  };


  const handleDelete = async (userId) => {
    // Validate userId is a valid UUID
    if (!userId || !isValidUUID(userId)) {
      Swal.fire({
        title: 'Error',
        text: 'Invalid user ID',
        icon: 'error',
        confirmButtonColor: '#517ea6'
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'Confirm Deletion',
      html: `<p>Are you sure you want to delete this user?</p><p>This action cannot be undone.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#517ea6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await UserService.deleteUser(userId);
        
        if (response && response.statusCode === 200) {
          // Update local state
          if (activeTab === 'mentors') {
            setMentors(mentors.filter(mentor => mentor.userId !== userId));
          } else {
            setStudents(students.filter(student => student.userId !== userId));
          }
          
          Swal.fire({
            title: 'Deleted!',
            text: response.message || 'User deleted successfully',
            icon: 'success',
            confirmButtonColor: '#517ea6'
          });
        } else {
          throw new Error(response?.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete user',
          icon: 'error',
          confirmButtonColor: '#517ea6'
        });
      }
    }
  };
  
  // UUID validation helper
  const isValidUUID = (uuid) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };
  return (
    <GeneralLayout role={auth.role}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>👥</span>
            User Management
          </h1>
          <div className={styles.actions}>
            <button 
              onClick={handleCreateNew}
              className={styles.createButton}
            >
              <FaPlus className={styles.buttonIcon} />
              Create New User
            </button>
          </div>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'mentors' ? styles.active : ''}`}
              onClick={() => setActiveTab('mentors')}
            >
              <FaChalkboardTeacher className={styles.tabIcon} />
              Mentors
              <span className={styles.countBadge}>{mentors.length}</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'students' ? styles.active : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <FaUserGraduate className={styles.tabIcon} />
              Students
              <span className={styles.countBadge}>{students.length}</span>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading user data...</p>
            </div>
          ) : (
            <UserTable
              users={activeTab === 'mentors' ? mentors : students}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
            />
          )}
        </div>

        {isModalOpen && (
          <UserModal
            user={selectedUser}
            roles={roles}
            onClose={handleModalClose}
            onSave={handleSave}
            isEditMode={!isCreateMode}
            isCreateMode={isCreateMode}
          />
        )}
      </div>
    </GeneralLayout>
  );
};

export default UserManagementPage;