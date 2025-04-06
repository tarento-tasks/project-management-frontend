import React, { useState } from "react";
import styles from "./addEntryModal.module.css";

const AddEntryModal = ({ title, placeholder, onClose, onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className={styles.textarea}
          />
          <div className={styles.actions}>
            <button type="submit" className={styles.submit}>Submit</button>
            <button type="button" onClick={onClose} className={styles.cancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
