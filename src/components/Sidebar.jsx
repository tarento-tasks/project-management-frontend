import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaProjectDiagram, FaTasks, FaBars ,FaUserPlus,FaFolderOpen, FaChalkboardTeacher, FaUserGraduate, FaComment, FaCommentDots, FaUserCheck, FaInfoCircle } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import logo from "../assets/Projecthive.png";

import styles from "./sidebar.module.css"; 

const sidebarItems = {
    admin: [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FaUser /> },
        { name: "Projects", path: "/admin/projects", icon: <FaFolderOpen /> },
        { name: "Requests", path: "/admin/requests", icon: <FaTasks /> },
        { name: "Add Project", path: "/admin/new-project", icon: <FaProjectDiagram /> },
        { name: "New User", path: "/admin/new-user", icon: <FaUserPlus /> },
        { name: "Mentors", path: "/admin/mentors", icon: <FaChalkboardTeacher /> },
        { name: "Students", path: "/admin/students", icon: <FaUserGraduate /> },
      ],
      mentor: [
        { name: "Dashboard", path: "/mentor/dashboard", icon: <FaUser /> },
        { name: "New Task", path: "/mentor/new-task", icon: <FaTasks /> },
        { name: "Comments", path: "/mentor/comments", icon: <FaComment /> },
        { name: "Students", path: "/mentor/students", icon: <FaUserGraduate /> },
      ],
      student: [
        { name: "Dashboard", path: "/student/dashboard", icon: <FaUser /> },
        { name: "Feedbacks", path: "/student/feedbacks", icon: <FaCommentDots /> },
        { name: "Enrollments", path: "/student/enrollments", icon: <FaUserCheck /> },
        { name: "Request Status", path: "/student/request-status", icon: <FaInfoCircle /> },
      ],
};

const Sidebar = ({ role }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`d-flex ${styles.sidebarWrapper}`}>
      <div className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>


        <div className={styles.logoSection}>
          <img src={logo} alt="ProjectHive Logo" className={expanded ? styles.fullLogo : styles.miniLogo} />
          {expanded && <span className={styles.logoText}>ProjectHive</span>}
        </div>
        <button className={styles.toggleBtn} onClick={() => setExpanded(!expanded)}>
          <FaBars />
        </button>

        

        <Nav className="flex-column">
          {sidebarItems[role]?.map((item) => (
            <Nav.Link as={Link} to={item.path} key={item.path} className={`d-flex align-items-center ${styles.navLink}`}>
              {item.icon}
              {expanded && <span className="ms-2">{item.name}</span>}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
