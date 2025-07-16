// NavBar.jsx
import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

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
            <a href="#home">Experience</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <a
          href="https://github.com/HarrisHamid"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-icon"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/hhamid26/"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-icon"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
