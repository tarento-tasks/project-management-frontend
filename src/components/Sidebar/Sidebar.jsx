import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/src/assets/logopms1.png";
import styles from "./sidebar.module.css";

const sidebarItems = {
  ADMIN: [
    { 
      name: "Home", 
      path: "/admin/dashboard", 
      icon: <i className="bi bi-house-door"></i> 
    },
    { 
      name: "Projects", 
      icon: <i className="bi bi-folder"></i>,
      subItems: [
        { name: "All Projects", path: "/all-projects" },
        { name: "Tasks", path: "/admin/projects/tasks" },
        { name: "New Project", path: "/newprojects" }
      ]
    },
    { 
      name: "Requests", 
      path: "/admin/requests", 
      icon: <i className="bi bi-list-check"></i> 
    },
    { 
      name: "Users", 
      path: "/users", 
      icon: <i className="bi bi-people"></i>,
      
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
  MENTOR: [
    { 
      name: "Home", 
      path: "/mentor/dashboard", 
      icon: <i className="bi bi-house-door"></i> 
    },
    { 
      name: "Projects", 
      icon: <i className="bi bi-folder"></i>,
      subItems: [
        { name: "Tasks", path: "/all-projects" },
        { name: "New Task", path: "/newtask", icon: <i className="bi bi-plus-circle"></i> },
        

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
  STUDENT: [
    { 
      name: "Home", 
      path: "/student/dashboard", 
      icon: <i className="bi bi-house-door"></i> 
    },
    { 
      name: "Projects", 
      icon: <i className="bi bi-folder"></i>,
      subItems: [
        { name: "Tasks", path: "/all-projects" }
      ]
    },
    { 
      name: "Feedback", 
      path: "/student/feedbacks",
      icon: <i className="bi bi-chat-square-text"></i>
    },
    { 
      name: "Explore", 
      path: "/student/projects", 
      icon: <i className="bi bi-compass"></i> 
    },
    { 
      name: "Enrollment Status", 
      path: "/student/enrollments", 
      icon: <i className="bi bi-clipboard-check"></i> 
    }
  ]
};

const Sidebar = ({ role = "ADMIN" }) => {
  const [expanded, setExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Bootstrap's md breakpoint
      if (window.innerWidth >= 768) {
        setExpanded(true); // Always show expanded on desktop
      } else {
        setExpanded(false); // Collapse by default on mobile
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

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
              {expanded && (
                <i 
                  className={`bi bi-chevron-${openSubmenus[item.name] ? 'down' : 'right'}`} 
                  style={{ marginLeft: 'auto' }}
                />
              )}
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
            onClick={() => isMobile && setExpanded(false)} // Close sidebar on mobile when clicking a link
          >
            {item.icon}
            {expanded && <span className={styles.sidebarText}>{item.name}</span>}
          </Link>
        )}
      </div>
    ));
  };

  const normalizedRole = role?.toUpperCase() || "ADMIN";
  const currentItems = sidebarItems[normalizedRole] || [];

  return (
    <>
      {/* Mobile Hamburger Button (only shows on small screens) */}
      {isMobile && (
        <button 
          className={`${styles.mobileToggle} btn btn-dark`}
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>
      )}

      <div className={`${styles.sidebarContainer} ${expanded ? styles.expanded : styles.collapsed}`}>
        <div className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ''}`}>
          <div className={styles.logoSection}>
            <img 
              src={logo} 
              alt="Logo" 
              className={expanded ? styles.fullLogo : styles.miniLogo} 
            />
          </div>
          
          <div className={styles.navContainer}>
            {renderSubItems(currentItems)}
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && expanded && (
          <div 
            className={styles.sidebarOverlay}
            onClick={() => setExpanded(false)}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;