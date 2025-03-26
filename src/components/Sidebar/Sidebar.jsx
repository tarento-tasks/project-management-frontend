import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/src/assets/logopms1.png";
import styles from "./sidebar.module.css";

const sidebarItems = {
  admin: [
    { 
      name: "Home", 
      path: "/admin/dashboard", 
      icon: <i className="bi bi-house-door"></i> 
    },
    { 
      name: "Projects", 
      icon: <i className="bi bi-folder"></i>,
      subItems: [
        { name: "All Projects", path: "/admin/projects" },
        { name: "Tasks", path: "/admin/projects/tasks" },
        { name: "New Project", path: "/admin/new-project", icon: <i className="bi bi-plus-circle"></i> }
      ]
    },
    { 
      name: "Requests", 
      path: "/admin/requests", 
      icon: <i className="bi bi-list-check"></i> 
    },
    { 
      name: "Users", 
      icon: <i className="bi bi-people"></i>,
      subItems: [
        { name: "Mentors", path: "/admin/mentors" },
        { name: "Students", path: "/admin/students" }
      ]
    },
    { 
      name: "Add Users", 
      icon: <i className="bi bi-person-plus"></i>,
      subItems: [
        { name: "New User", path: "/admin/new-user" },
        { name: "Edit Profiles", path: "/admin/edit-profile" }
      ]
    },
    { 
      name: "Review", 
      path: "/admin/review", 
      icon: <i className="bi bi-clipboard-check"></i> 
    },
    { 
      name: "Comments", 
      path: "/admin/comments", 
      icon: <i className="bi bi-chat-left-text"></i> 
    }
  ],
  mentor: [
    { 
      name: "Home", 
      path: "/mentor/dashboard", 
      icon: <i className="bi bi-house-door"></i> 
    },
    { 
      name: "Projects", 
      icon: <i className="bi bi-folder"></i>,
      subItems: [
        { name: "Tasks", path: "/mentor/tasks" },
        { name: "New Task", path: "/mentor/new-task", icon: <i className="bi bi-plus-circle"></i> }
      ]
    },
    { 
      name: "Students", 
      path: "/mentor/students",
      icon: <i className="bi bi-mortarboard"></i>
    },
    { 
      name: "Review", 
      path: "/mentor/review", 
      icon: <i className="bi bi-clipboard-check"></i> 
    },
    { 
      name: "Comments", 
      path: "/mentor/comments", 
      icon: <i className="bi bi-chat-left-text"></i> 
    }
  ],
  student: [
    { 
      name: "Home", 
      path: "/student/dashboard", 
      icon: <i className="bi bi-house-door"></i> 
    },
    { 
      name: "Projects", 
      icon: <i className="bi bi-folder"></i>,
      subItems: [
        { name: "Tasks", path: "/student/tasks" }
      ]
    },
    { 
      name: "Feedback", 
      path: "/student/feedbacks",
      icon: <i className="bi bi-chat-square-text"></i>
    },
    { 
      name: "Explore", 
      path: "/student/explore", 
      icon: <i className="bi bi-compass"></i> 
    },
    { 
      name: "Enrollment Status", 
      path: "/student/enrollments", 
      icon: <i className="bi bi-clipboard-check"></i> 
    }
  ]
};

const Sidebar = ({ role = "admin" }) => {
  const [expanded, setExpanded] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (name) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderSubItems = (items, level = 0) => {
    return items.map((item) => (
      <div key={`${item.name}-${level}`}>
        {item.subItems ? (
          <>
            <div 
              className={`${styles.navLink} ${styles.navHeader}`}
              onClick={() => toggleSubmenu(item.name)}
            >
              {item.icon}
              {expanded && <span className={styles.sidebarText}>{item.name}</span>}
            </div>
            
            {openSubmenus[item.name] && expanded && (
              <div className={`${styles.subMenu} ${level > 0 ? styles.nestedSubMenu : ''}`}>
                {renderSubItems(item.subItems, level + 1)}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className={`${styles.navLink} ${level > 0 ? styles.subItem : ''}`}
          >
            {item.icon}
            {expanded && <span className={styles.sidebarText}>{item.name}</span>}
          </Link>
        )}
      </div>
    ));
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
        <div className={styles.logoSection}>
          <img 
            src={logo} 
            alt="Logo" 
            className={expanded ? styles.fullLogo : styles.miniLogo} 
          />
        </div>
        
        <button 
          className={styles.toggleBtn} 
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <i className="bi bi-list"></i>
        </button>

        <div className={styles.navContainer}>
          {renderSubItems(sidebarItems[role] || [])}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;