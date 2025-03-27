import React from "react";
import { Card, CardBody, CardTitle, CardText } from "react-bootstrap";
import { FaUser, FaProjectDiagram, FaTasks, FaChartBar } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="container">
      <h2 className="mb-4">Admin Dashboard</h2>
      <p>Welcome, Admin! Manage users, projects, and requests here.</p>

      {/* Dashboard Summary Cards */}
      <div className="row">
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <CardBody>
              <CardTitle><FaUser className="me-2 text-primary" />Total Users</CardTitle>
              <CardText className="fs-4 fw-bold">120</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <CardBody>
              <CardTitle><FaProjectDiagram className="me-2 text-success" />Total Projects</CardTitle>
              <CardText className="fs-4 fw-bold">45</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <CardBody>
              <CardTitle><FaTasks className="me-2 text-warning" />Pending Requests</CardTitle>
              <CardText className="fs-4 fw-bold">10</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <CardBody>
              <CardTitle><FaChartBar className="me-2 text-danger" />Active Users</CardTitle>
              <CardText className="fs-4 fw-bold">85</CardText>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-5">
        <h4>Recent Activities</h4>
        <ul className="list-group">
          <li className="list-group-item">🔹 John Doe added a new project: <strong>AI Research</strong></li>
          <li className="list-group-item">🔹 Alice Smith approved a funding request</li>
          <li className="list-group-item">🔹 Michael Brown updated project details for <strong>Blockchain App</strong></li>
          <li className="list-group-item">🔹 Sarah Johnson assigned a new task to developers</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
