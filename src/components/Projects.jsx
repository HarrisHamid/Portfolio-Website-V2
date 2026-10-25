import React from "react";
import "../App.css";
import Micromobile from "../assets/Project_Images/Micromobile.png";
import PantryTracker from "../assets/Project_Images/PantryTracker.png";
import capfinity from "../assets/Project_Images/capfinity.png";
import triva from "../assets/Project_Images/Trivia.png";
import local from "../assets/Project_Images/local.svg";
import placeholder from "../assets/Project_Images/placeholder.svg";

const ProjectCard = ({
  title = "",
  description = "",
  technologies = [""],
  image = "",
  imageType = "",
}) => {
  return (
    <div className="project-card">
      <div
        className={`project-header ${
          imageType === "logo" ? "logo-header" : "banner-header"
        }`}
      >
        <img
          src={image}
          alt={title}
          className={`project-image ${
            imageType === "logo" ? "logo-image" : "banner-image"
          }`}
        />
      </div>
      <div className="project-content">
        <h2 className="project-title">{title}</h2>
        <p className="project-description">{description}</p>
        <div className="tech-tags">
          {technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage with multiple projects
const ProjectsShowcase = () => {
  const projects = [
    {
      title: "Senior Design Marketplace",
      description:
        "Full-stack web app for Stevens Institute of Technology that streamlines browsing senior design projects, forming groups, and expressing interest",
      technologies: [
        "TypeScript",
        "Node.js",
        "Express.js",
        "MongoDB",
        "React",
        "Tailwind CSS",
        "Resend",
      ],
      image: placeholder,
      imageType: "banner",
    },
    {
      title: "Namaz",
      description:
        "Chrome extension that fetches Salah times for any city and auto-syncs them to a dedicated Google Calendar every day",
      technologies: [
        "JavaScript",
        "Chrome Extension (MV3)",
        "Google Calendar API",
        "OAuth 2.0",
        "Aladhan API",
      ],
      image: placeholder,
      imageType: "banner",
    },
    {
      title: "LocalSentinel",
      description:
        "AI VSCode extension that scans code for potential security vulnerabilities",
      technologies: ["JavaScript", "Python", "LM Studio"],
      image: local,
      imageType: "logo",
    },
    {
      title: "MicroMobile",
      description:
        "Full-stack peer-to-peer micro-mobility vehicle rental platform",
      technologies: [
        "JavaScript",
        "Node.js",
        "MongoDB",
        "Express.js",
        "Bootstrap",
        "Handlebars",
      ],
      image: Micromobile,
      imageType: "s",
    },
    // {
    //   title: "PantryTracker",
    //   description: "Full-stack AI pantry management and recipe suggestion app",
    //   technologies: ["JavaScript", "Next.js", "Gemini API", "Firebase"],
    //   image: PantryTracker,
    //   imageType: "banner",
    // },
    {
      title: "Capfinity - SpartaHack9",
      description:
        "Investment strategy tool that dynamically adjusts a portfolio based on month-over-month changes in car sales data in America",
      technologies: [
        "Python",
        "Matplotlib",
        "Jupyter Notebook",
        "Pandas",
        "NumPy",
      ],
      image: capfinity,
      imageType: "logo",
    },
    {
      title: "TriviaNight",
      description:
        "Collaborative terminal run trivia game with real-time updates and multi-client support",
      technologies: ["C", "Socket Programming", "TCP/IP"],
      image: triva,
      imageType: "logo",
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="projects-showcase">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
            image={project.image}
            imageType={project.imageType}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsShowcase;
