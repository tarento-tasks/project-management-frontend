import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import styles from "./buttonComponent.module.css";

const ButtonComponent = ({ 
  variant, 
  size, 
  onClick, 
  disabled, 
  isLoading, 
  children 
}) => {
  return (
    <Button 
      className={`${styles.customButton} w-100 `} 
      variant={variant} 
      size={size} 
      onClick={onClick} 
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </Button>
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
