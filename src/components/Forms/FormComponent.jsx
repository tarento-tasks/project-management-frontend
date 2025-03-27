import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./formComponent.module.css";

const FormComponent = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.name === "skills" ? [] : "", 
    }), {})
  );

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    
    if (fieldName === "skills" && value) {
      if (!formData.skills.includes(value)) {
        setFormData({ ...formData, skills: [...formData.skills, value] });
      }
    } else {
      setFormData({ ...formData, [fieldName]: value });
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <label className={styles.formLabel}>{field.label}</label>

            {field.type === "textarea" ? (
              <textarea
                className={styles.formControl}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                placeholder={field.placeholder}
              />
            ) : field.type === "select" && field.name === "skills" ? (
              <>
                <select
                  className={styles.formControl}
                  onChange={(e) => handleChange(e, "skills")}
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

                {/* Selected skills displayed inline */}
                <div className={styles.selectedSkills}>
                  {formData.skills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                      <button type="button" className={styles.removeSkill} onClick={() => removeSkill(skill)}>
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : field.type === "select" ? (
              <select
                className={styles.formControl}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, field.name)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={styles.formControl}
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
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
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormComponent;
