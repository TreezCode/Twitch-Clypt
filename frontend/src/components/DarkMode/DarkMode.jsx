import React from 'react';
import '../DarkMode.css';

// Check the users theme preference
const storedTheme = localStorage.getItem('theme');
const prefersDark =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultDark =
  storedTheme === 'dark' || (storedTheme === null && prefersDark);

const setDark = () => {
  localStorage.setItem('theme', 'dark');
  document.documentElement.setAttribute('data-theme', 'dark');
};
const setLight = () => {
  localStorage.setItem('theme', 'light');
  document.documentElement.setAttribute('data-theme', 'light');
};

if (defaultDark) {
  setDark();
}

const toggleTheme = (e) => {
  if (e.target.checked) {
    setDark();
  } else {
    setLight();
  }
};

function DarkMode() {
  return (
    <>
      <span className="dark-mode">
        <span>☀️</span>
        <input
          type="checkbox"
          name="switch"
          id="switch"
          onChange={toggleTheme}
          defaultChecked={defaultDark}
        />
        <label htmlFor="switch"></label>
        <span>🌘</span>
      </span>
    </>
  );
}

export default DarkMode;
