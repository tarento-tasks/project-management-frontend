import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./formComponent.module.css";

const FormComponent = ({
  fields,
  onSubmit,
  validateOnBlur = true,
  validateOnChange = false,
  className = "",
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.name === "skills" ? [] : "",
    }), {})
  );

  const [errors, setErrors] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: null,
    }), {})
  );

  const validateField = (name, value) => {
    const field = fields.find(f => f.name === name);
    if (!field?.validation) return null;

    const { validation } = field;

    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return "This field is required";
    }

    if (validation.minLength && value?.length < validation.minLength) {
      return validation.message || `Minimum ${validation.minLength} characters required`;
    }

    if (validation.maxLength && value?.length > validation.maxLength) {
      return validation.message || `Maximum ${validation.maxLength} characters allowed`;
    }

    if (validation.isFutureDate && new Date(value) <= new Date()) {
      return validation.message || "Date must be in the future";
    }

    if (validation.isAfterField && formData[validation.isAfterField]) {
      if (new Date(value) <= new Date(formData[validation.isAfterField])) {
        return validation.message || `Date must be after ${validation.isAfterField}`;
      }
    }

    return null;
  };

  const handleChange = (e, fieldName) => {
    const value = e.target.value;
    let newValue = value;

    if (fieldName === "skills" && value) {
      if (!formData.skills.includes(value)) {
        newValue = [...formData.skills, value];
      }
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldName === "skills" ? newValue : value
    }));

    if (validateOnChange) {
      const error = validateField(fieldName, newValue);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (e, fieldName) => {
    if (validateOnBlur) {
      const value = fieldName === "skills" ? formData.skills : e.target.value;
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const removeSkill = (skill) => {
    const newSkills = formData.skills.filter((s) => s !== skill);
    setFormData({
      ...formData,
      skills: newSkills,
    });

    if (validateOnChange || validateOnBlur) {
      const error = validateField("skills", newSkills);
      setErrors(prev => ({ ...prev, skills: error }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    fields.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field.name, value);
      newErrors[field.name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.criteria) {
      formData.criteria = "Default Criteria";
    }
    if (!validateForm()) return;
    onSubmit(formData);
  };

  // Group fields by type for card-based layout
  const renderFormFields = () => {
    return (
      <div className={styles.formCards}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formCard}>
            <div className={styles.cardHeader}>
              <label className={styles.formLabel}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
            </div>

            <div className={styles.cardBody}>
              {field.type === "textarea" ? (
                <>
                  <textarea
                    className={`${styles.formControl} ${errors[field.name] ? styles.error : ''}`}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(e, field.name)}
                    onBlur={(e) => handleBlur(e, field.name)}
                    placeholder={field.placeholder}
                    rows={field.rows}
                  />
                </>
              ) : field.type === "select" && field.name === "skills" ? (
                <>
                  <select
                    className={`${styles.formControl} ${errors[field.name] ? styles.error : ''}`}
                    onChange={(e) => handleChange(e, "skills")}
                    onBlur={(e) => handleBlur(e, "skills")}
                    value=""
                  >
                    <option value="" disabled>Select a skill</option>
                    {field.options
                      .filter((option) => !formData.skills.includes(option))
                      .map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>

                  <div className={styles.selectedSkills}>
                    {formData.skills.map((skill, index) => (
                      <span key={index} className={styles.skillTag}>
                        {skill}
                        <button 
                          type="button" 
                          className={styles.removeSkill} 
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                </>
              ) : field.type === "select" ? (
                <>
                  <select
                    className={`${styles.formControl} ${errors[field.name] ? styles.error : ''}`}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(e, field.name)}
                    onBlur={(e) => handleBlur(e, field.name)}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <input
                    className={`${styles.formControl} ${errors[field.name] ? styles.error : ''}`}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(e, field.name)}
                    onBlur={(e) => handleBlur(e, field.name)}
                    placeholder={field.placeholder}
                  />
                </>
              )}
              {errors[field.name] && <div className={styles.errorMessage}>{errors[field.name]}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.formContainer} ${className}`}>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

FormComponent.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      options: PropTypes.array,
      required: PropTypes.bool,
      validation: PropTypes.shape({
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        isFutureDate: PropTypes.bool,
        isAfterField: PropTypes.string,
        message: PropTypes.string,
      }),
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  className: PropTypes.string,
};

export default FormComponent;