import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import GeneralLayout from "../layouts/GeneralLayout";
import { useRecoilValue } from "recoil";
import { authState } from "../states/authState";
import { getComments, addComment } from "../services/CommentService";
import { getFeedback, addFeedback } from "../services/FeedbackService";
import { FaCommentDots, FaComments, FaUser, FaPaperPlane } from "react-icons/fa";
import styles from "./commentsFeedbackPage.module.css";

const CommentsFeedbackPage = () => {
  const { taskId } = useParams();
  const auth = useRecoilValue(authState);
  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const isMentorOrAdmin = auth.role === "MENTOR" || auth.role === "ADMIN";
  const isStudent = auth.role === "STUDENT";
  const canAddEntry = (isMentorOrAdmin && activeTab === "feedback") || 
                     (isStudent && activeTab === "comments");

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

  useEffect(() => {
    scrollToBottom();
  }, [comments, feedbacks, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const injectUserNames = async (entries) => {
    const ids = [...new Set(entries.map(e => e.userId || e.mentorId))];
    const userMap = {};

    for (const id of ids) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/users?userId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Fetch failed");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      if (activeTab === "comments") {
        await addComment(taskId, auth.userId, message);
        const updated = await getComments(taskId);
        const withNames = await injectUserNames(updated);
        setComments(withNames);
      } else {
        await addFeedback(taskId, auth.userId, message);
        const updated = await getFeedback(taskId);
        const withNames = await injectUserNames(updated);
        setFeedbacks(withNames);
      }
      setMessage("");
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GeneralLayout role={auth.role}>
      <div className={styles.container}>
        <div className={styles.contentCard}>
          <div className={styles.header}>
            <h2 className={styles.title}>Task Discussions</h2>
          </div>

          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "comments" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("comments")}
            >
              <FaComments />
              Comments ({comments.length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "feedback" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("feedback")}
            >
              <FaCommentDots />
              Feedback ({feedbacks.length})
            </button>
          </div>

          <div className={styles.entriesContainer}>
            {activeTab === "comments" ? (
              comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className={styles.entryCard}>
                    <div className={styles.entryHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.userIcon}>
                          <FaUser />
                        </div>
                        <span className={styles.userName}>{comment.userName}</span>
                      </div>
                      <span className={styles.date}>{comment.createdAt}</span>
                    </div>
                    <div className={styles.entryContent}>{comment.comment}</div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  No comments yet. Be the first to add one!
                </div>
              )
            ) : feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <div key={feedback.id} className={styles.entryCard}>
                  <div className={styles.entryHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.userIcon}>
                        <FaUser />
                      </div>
                      <span className={styles.userName}>{feedback.userName}</span>
                    </div>
                    <span className={styles.date}>{feedback.createdAt}</span>
                  </div>
                  <div className={styles.entryContent}>{feedback.feedback}</div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                No feedback yet. Be the first to add some!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {canAddEntry && (
            <form onSubmit={handleSubmit} className={styles.messageInputContainer}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Type your ${activeTab === "comments" ? "comment" : "feedback"} here...`}
                className={styles.messageInput}
                disabled={loading}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!message.trim() || loading}
              >
                <FaPaperPlane />
              </button>
            </form>
          )}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default CommentsFeedbackPage;