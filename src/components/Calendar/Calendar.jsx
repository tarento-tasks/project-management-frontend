import React, { useState } from 'react';
import styles from './calendar.module.css';

const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(new Date(year, month, i));
  }

  return daysArray;
};

const Calendar = ({ upcomingDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysArray = generateCalendarDays(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const isUpcomingDate = (date) => {
    return upcomingDates.some(
      (project) =>
        date &&
        date.getDate() === project.dueDate.getDate() &&
        date.getMonth() === project.dueDate.getMonth() &&
        date.getFullYear() === project.dueDate.getFullYear()
    );
  };

  const getProjectsForDate = (date) => {
    return upcomingDates.filter(
      (project) =>
        date &&
        date.getDate() === project.dueDate.getDate() &&
        date.getMonth() === project.dueDate.getMonth() &&
        date.getFullYear() === project.dueDate.getFullYear()
    );
  };

  const handleDateClick = (date) => {
    if (date && isUpcomingDate(date)) {
      setSelectedDate(date);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navButton}>
          &#9664;
        </button>
        <h2 className={styles.monthTitle}>
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button onClick={nextMonth} className={styles.navButton}>
          &#9654;
        </button>
      </div>

      {/* Days of the week */}
      <div className={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={styles.daysGrid}>
        {daysArray.map((date, index) => (
          <div
            key={index}
            className={`${styles.day} ${
              date ? (isUpcomingDate(date) ? styles.highlighted : '') : styles.empty
            } ${selectedDate && date && date.getTime() === selectedDate.getTime() ? styles.selected : ''}`}
            onClick={() => handleDateClick(date)}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>

      {/* Project details panel */}
      {selectedDate && (
        <div className={styles.projectsPanel}>
          <h3 className={styles.panelTitle}>
            Projects due on {selectedDate.toLocaleDateString()}
          </h3>
          <ul className={styles.projectList}>
            {getProjectsForDate(selectedDate).map((project, index) => (
              <li key={index} className={styles.projectItem}>
                <span className={styles.projectName}>{project.name}</span>
                <span className={styles.projectDetails}>
                 
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendar;