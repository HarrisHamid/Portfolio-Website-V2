// NavBar.jsx
import React from "react";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="#home" className="navbar-brand">
          Harris Hamid
        </a>
      </div>
      <div className="navbar-center">
        <ul className="navbar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
