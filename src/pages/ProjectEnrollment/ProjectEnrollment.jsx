import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProjectEnrollmentCard from "../../components/ProjectEnrollmentCard/ProjectEnrollmentCard";
import "bootstrap/dist/css/bootstrap.min.css";

const ProjectEnrollment = () => {
  const projects = [
    {
      title: "AI-Based Chatbot",
      objective: "Develop an AI-powered chatbot for customer service.",
      description: "Create an intelligent chatbot using NLP and machine learning.",
      prerequisites: "Python, NLP, Machine Learning",
      mentor: "Dr. John Doe",
      lastDate: "April 15, 2025",
    },
    {
      title: "Blockchain Voting System",
      objective: "Build a decentralized voting platform.",
      description: "Ensure transparency and security using blockchain technology.",
      prerequisites: "Solidity, Ethereum, Cryptography",
      mentor: "Prof. Alice Smith",
      lastDate: "April 20, 2025",
    },
    {
      title: "IoT-Based Smart Home",
      objective: "Create an IoT-enabled smart home automation system.",
      description: "Develop a system to control appliances remotely.",
      prerequisites: "IoT, Arduino, Embedded Systems",
      mentor: "Dr. Mark Johnson",
      lastDate: "April 25, 2025",
    },
    {
      title: "Autonomous Drone Delivery",
      objective: "Design a drone-based package delivery system.",
      description: "Develop an autonomous drone that delivers packages efficiently.",
      prerequisites: "AI, Robotics, GPS Navigation",
      mentor: "Dr. Emily Davis",
      lastDate: "April 30, 2025",
    },
    {
      title: "Augmented Reality Shopping",
      objective: "Implement AR-based virtual shopping experiences.",
      description: "Enable customers to try on clothes using AR technology.",
      prerequisites: "ARKit, Unity, 3D Modeling",
      mentor: "Dr. Lisa Carter",
      lastDate: "May 5, 2025",
    },
    {
      title: "Cybersecurity Threat Detection",
      objective: "Develop a system to identify cybersecurity threats.",
      description: "Use AI to analyze patterns and detect cyber threats.",
      prerequisites: "Python, Cybersecurity, AI",
      mentor: "Dr. Kevin Brown",
      lastDate: "May 10, 2025",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container py-4">
      <h2 className="text-start custom-title">🔍 Explore & Enroll in Exciting Projects 🚀</h2>

        <p className="text-start text-muted mb-4">
          Browse through the available projects and enroll in the ones that match your interest.
        </p>

        <div className="row g-4">
          {projects.map((project, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12">
              <ProjectEnrollmentCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectEnrollment;
