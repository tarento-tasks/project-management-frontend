import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar/Sidebar";  // Correct path
import Header from "../components/Header/Header";
import "./dashboardLayout.css"; // Assuming you have a separate CSS file for the layout

const DashboardLayout = ({ children, userName, userRole }) => {
  return (
    <div className="layoutWrapper">
      {/* Sidebar */}
      <Sidebar role={userRole} />

      {/* Main Content Area */}
      <div className="mainContent">
        {/* Header */}
        <Header userName={userName} userRole={userRole} />

        {/* Content Area */}
        <Container fluid className="mt-4">
          <Row>
            <Col>{children}</Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;
