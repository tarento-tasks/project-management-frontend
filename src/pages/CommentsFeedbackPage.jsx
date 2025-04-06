import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GeneralLayout from "../layouts/GeneralLayout";
import { useRecoilValue } from "recoil";
import { authState } from "../states/authState";
import { getComments, addComment } from "../services/CommentService";
import { getFeedback, addFeedback } from "../services/FeedbackService";
import Table from "../components/Table/Table";
import AddEntryModal from "../components/Modal/AddEntryModal";
import styles from "./commentsFeedbackPage.module.css";
import { FaCommentDots, FaComments } from "react-icons/fa";

const CommentsFeedbackPage = () => {
  const { taskId } = useParams();
  const auth = useRecoilValue(authState);
  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMentorOrAdmin = auth.role === "MENTOR" || auth.role === "ADMIN";
  const isStudent = auth.role === "STUDENT";

  useEffect(() => {
    if (!taskId) return;

    const fetchData = async () => {
      try {
        if (isMentorOrAdmin || isStudent) {
          const commentRes = await getComments(taskId);
          const commentWithNames = await injectUserNames(commentRes);
          setComments(commentWithNames);

          const feedbackRes = await getFeedback(taskId);
          const feedbackWithNames = await injectUserNames(feedbackRes);
          setFeedbacks(feedbackWithNames);
        }
      } catch (error) {
        console.error("Failed to fetch comments/feedback:", error);
      }
    };

    fetchData();
  }, [taskId, auth.role]);

  const injectUserNames = async (entries, token) => {
    const ids = [...new Set(entries.map(e => e.userId || e.mentorId))];
    const userMap = {};
  
    for (const id of ids) {
      try {
        const token = localStorage.getItem("token"); 

        const res = await fetch(`http://localhost:8080/api/users?userId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const contentType = res.headers.get("Content-Type");
  
        if (!res.ok) {
          console.error(`User fetch failed: ${res.status} ${res.statusText}`);
          throw new Error("Fetch failed");
        }
  
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Expected JSON but got:", text);
          throw new Error("Invalid content type");
        }
  
        const data = await res.json();
        userMap[id] = data.response?.name || "Unknown";
  
      } catch (err) {
        console.warn("User fetch failed for ID:", id, err);
        userMap[id] = "Unknown";
      }
    }
  
    return entries.map(e => ({
      ...e,
      userName: userMap[e.userId || e.mentorId],
      createdAt: new Date(e.createdAt).toLocaleString()
    }));
  };
  
  

  const commentColumns = [
    { key: "comment", label: "Comment" },
    { key: "userName", label: "By" },
    { key: "createdAt", label: "Created At" }
  ];

  const feedbackColumns = [
    { key: "feedback", label: "Feedback" },
    { key: "userName", label: "By" },
    { key: "createdAt", label: "Created At" }
  ];

  const handleAdd = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = async (text) => {
    if (!text) return;

    try {
      setLoading(true);
      if (activeTab === "comments") {
        await addComment(taskId, auth.userId, text);
        const updated = await getComments(taskId);
        const withNames = await injectUserNames(updated);
        setComments(withNames);
      } else {
        await addFeedback(taskId, auth.userId, text);
        const updated = await getFeedback(taskId);
        const withNames = await injectUserNames(updated);
        setFeedbacks(withNames);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GeneralLayout role={auth.role}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Task Comments & Feedback</h2>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "comments" ? styles.active : ""}`}
              onClick={() => setActiveTab("comments")}
            >
              <FaComments /> Comments
            </button>
            <button
              className={`${styles.tab} ${activeTab === "feedback" ? styles.active : ""}`}
              onClick={() => setActiveTab("feedback")}
            >
              <FaCommentDots /> Feedback
            </button>
          </div>
          {(isMentorOrAdmin && activeTab === "feedback") ||
          (isStudent && activeTab === "comments") ? (
            <button className={styles.addButton} onClick={handleAdd}>
              {activeTab === "comments" ? "Add Comment" : "Add Feedback"}
            </button>
          ) : null}
        </div>

        <div className={styles.tableWrapper}>
          {activeTab === "comments" ? (
            <Table columns={commentColumns} data={comments} />
          ) : (
            <Table columns={feedbackColumns} data={feedbacks} />
          )}
        </div>

        {showModal && (
          <AddEntryModal
            onClose={handleClose}
            onSubmit={handleSubmit}
            title={activeTab === "comments" ? "Add Comment" : "Add Feedback"}
            placeholder={`Enter your ${activeTab === "comments" ? "comment" : "feedback"} here...`}
            loading={loading}
          />
        )}
      </div>
    </GeneralLayout>
  );
};

export default CommentsFeedbackPage;
