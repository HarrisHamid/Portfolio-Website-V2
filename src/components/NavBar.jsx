// NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Harris Hamid
        </Link>{" "}
        {/* Use Link */}
      </div>
      <div className="navbar-center">
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>{" "}
          <li>
            <Link to="/about">About</Link>
          </li>{" "}
          {/* Use Link */}
          <li>
            <Link to="/experience">Experience</Link>
          </li>{" "}
          {/* Use Link */}
          <li>
            <Link to="/projects">Projects</Link>
          </li>{" "}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
