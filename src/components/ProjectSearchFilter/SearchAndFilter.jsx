import React from 'react';
import styles from './searchAndFilter.module.css';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  filterOption,
  onFilterChange,
  skillFilter,
  onSkillChange,
  allSkills = [],
  filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'recommended', label: 'Recommended' },
    { value: 'open', label: 'Open for Enrollment' }
  ]
}) => {
  return (
    <div className={styles.searchFilterContainer}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
      
      <div className={styles.filterGroup}>
        <select
          value={filterOption}
          onChange={(e) => onFilterChange(e.target.value)}
          className={styles.filterSelect}
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {allSkills.length > 0 && (
          <select
            value={skillFilter}
            onChange={(e) => onSkillChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;