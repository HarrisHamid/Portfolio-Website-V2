import React, { useState } from "react";
import { FaGithub, FaLinkedinIn, FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="#home" className="navbar-brand">
          Harris Hamid
        </a>
      </div>

      {/* Desktop Navigation */}
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
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {/* Social Icons - Always Visible */}
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

        {/* Hamburger Menu Button */}
        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : ""}`}>
        <ul className="mobile-links">
          <li>
            <a href="#home" onClick={closeMenu}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
          </li>
          <li>
            <a href="#experience" onClick={closeMenu}>
              Experience
            </a>
          </li>
          <li>
            <a href="#skills" onClick={closeMenu}>
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" onClick={closeMenu}>
              Projects
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
