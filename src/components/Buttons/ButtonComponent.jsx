import React from "react";
import PropTypes from "prop-types";
import styles from "./buttonComponent.module.css";

const ButtonComponent = ({ 
  variant, 
  size, 
  onClick, 
  disabled, 
  isLoading, 
  children 
}) => {
  // Map Bootstrap variants to your custom style
  const buttonClass = `${styles.submitButton} ${
    size === 'sm' ? styles.small : 
    size === 'md' ? styles.medium : 
    styles.large
  }`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

ButtonComponent.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

ButtonComponent.defaultProps = {
  variant: "primary",
  size: "lg",
  onClick: () => {},
  disabled: false,
  isLoading: false,
};

export default ButtonComponent;