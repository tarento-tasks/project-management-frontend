import React from "react";
import styles from "./signupcard.module.css";
import PropTypes from "prop-types";

const SignUpCard = ({ projectname, name, email, qualification, skills, previousWork, onAccept, onReject }) => {
  return (
    <div className={`card ${styles.signupCard} p-3`}>
      <div className="card-header bg-secondary text-white">{projectname}</div>
      <div className="card-body">
        <form>
          <div className="mb-2">
            <label className="form-label">Name:</label>
            <input type="text" className="form-control" value={name} readOnly />
          </div>
          <div className="mb-2">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" value={email} readOnly />
          </div>
          <div className="mb-2">
            <label className="form-label">Qualification:</label>
            <input type="text" className="form-control" value={qualification} readOnly />
          </div>
          <div className="mb-2">
            <label className="form-label">Skills:</label>
            <input type="text" className="form-control" value={skills} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Previous Work:</label>
            <input type="text" className="form-control" value={previousWork} readOnly />
          </div>
        </form>
      </div>
      <div className="card-footer text-center">
        <button type="button" className="btn btn-success me-2" onClick={onAccept}>
          Accept
        </button>
        <button type="button" className="btn btn-danger" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

// Define PropTypes
SignUpCard.propTypes = {
  projectname: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  qualification: PropTypes.string.isRequired,
  skills: PropTypes.string.isRequired,
  previousWork: PropTypes.string.isRequired,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
};

export default SignUpCard;
