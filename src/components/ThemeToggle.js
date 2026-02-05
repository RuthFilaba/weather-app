import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? (
        <>
          <i className="fas fa-moon"></i>
          Dark Mode
        </>
      ) : (
        <>
          <i className="fas fa-sun"></i>
          Light Mode
        </>
      )}
    </button>
  );
};

export default ThemeToggle;