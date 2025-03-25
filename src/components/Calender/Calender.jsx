import React, { useState, useEffect } from "react";
import { Calendar } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./calender.module.css";

const Calender = ({ projectDeadline }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format the dates for comparison (YYYY-MM-DD)
  const formatDate = (date) => date.toISOString().split("T")[0];

  const isToday = (date) => formatDate(date) === formatDate(currentDate);
  const isDeadline = (date) => formatDate(date) === formatDate(new Date(projectDeadline));

  return (
    <div className={`container ${styles.calendarContainer}`}>
      <h3 className="text-center mb-3">
        <Calendar className="me-2" /> Project Timeline
      </h3>
      <div className={`table-responsive ${styles.tableContainer}`}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center">Sunday</th>
              <th className="text-center">Monday</th>
              <th className="text-center">Tuesday</th>
              <th className="text-center">Wednesday</th>
              <th className="text-center">Thursday</th>
              <th className="text-center">Friday</th>
              <th className="text-center">Saturday</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, week) => (
              <tr key={week}>
                {[...Array(7)].map((_, day) => {
                  const date = new Date(currentDate);
                  date.setDate(currentDate.getDate() - currentDate.getDay() + day + week * 7);

                  return (
                    <td
                      key={day}
                      className={`text-center ${
                        isToday(date) ? styles.today : isDeadline(date) ? styles.deadline : ""
                      }`}
                    >
                      {date.getDate()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calender;
