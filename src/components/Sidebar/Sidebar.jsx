import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/src/assets/logopms1.png";
import styles from "./sidebar.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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
        { name: "New Project", path: "/newprojects" }
      ]
    },
    { 
      name: "Requests", 
      path: "/enrollments", 
      icon: <i className="bi bi-list-check"></i> 
    },
    { 
      name: "Users", 
      path: "/users", 
      icon: <i className="bi bi-people"></i> 
    },
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
      path: "/all-projects" 
    },
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
      path: "/all-projects" 
    },
    { 
      name: "Explore", 
      path: "/student/projects", 
      icon: <i className="bi bi-compass"></i> 
    },
    { 
      name: "Enrollment Status", 
      path: "/enrollments", 
      icon: <i className="bi bi-clipboard-check"></i> 
    }
  ]
};

const Sidebar = ({ role = "ADMIN" }) => {
  const [expanded, setExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const normalizedRole = role?.toUpperCase() || "ADMIN";

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
            onClick={() => setShowOffcanvas(false)} // Close on mobile nav click
          >
            {item.icon}
            {expanded && <span className={styles.sidebarText}>{item.name}</span>}
          </Link>
        )}
      </div>
    ));
  };

  const currentItems = sidebarItems[normalizedRole] || [];

  return (
    <>
      {/* Mobile Header with Hamburger - Only shows on small screens */}
      <div className="d-md-none fixed-top bg-light p-2 shadow-sm" style={{ zIndex: 1020,width: '12%',height: '69px'}}>
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowOffcanvas(true)}
          >
            <i className="bi bi-list"></i>
          </button>
          
        </div>
      </div>

      {/* Spacer to prevent content from being hidden under fixed header on mobile */}
      <div className="d-md-none" style={{ height: '60px' }}></div>

      {/* Desktop Sidebar - Only shows on medium+ screens */}
      <div className={`d-none d-md-flex ${styles.sidebarContainer}`}>
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
            {renderSubItems(currentItems)}
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <div 
        className={`offcanvas offcanvas-start ${showOffcanvas ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ 
          visibility: showOffcanvas ? 'visible' : 'hidden',
          width: '250px' // Set a fixed width
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowOffcanvas(false)}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className={styles.navContainer}>
            {/* Force expanded view in mobile menu */}
            {currentItems.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <>
                    <div 
                      className={`${styles.navLink} ${styles.navHeader}`}
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      {item.icon}
                      <span className={styles.sidebarText}>{item.name}</span>
                    </div>
                    
                    {openSubmenus[item.name] && (
                      <div className={styles.subMenu}>
                        {item.subItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`${styles.navLink} ${styles.subItem}`}
                            onClick={() => setShowOffcanvas(false)}
                          >
                            <span className={styles.sidebarText}>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={styles.navLink}
                    onClick={() => setShowOffcanvas(false)}
                  >
                    {item.icon}
                    <span className={styles.sidebarText}>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile when offcanvas is open */}
      {showOffcanvas && (
        <div 
          className="offcanvas-backdrop fade show"
          style={{ zIndex: 1019 }}
          onClick={() => setShowOffcanvas(false)}
        />
      )}
    </>
  );
};

export default Sidebar;