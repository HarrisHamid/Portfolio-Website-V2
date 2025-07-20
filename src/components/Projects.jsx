import React from "react";
import "../App.css";
import Micromobile from "../assets/Project_Images/Micromobile.png";
import PantryTracker from "../assets/Project_Images/PantryTracker.png";
import capfinity from "../assets/Project_Images/capfinity.png";
import PolyGlot from "../assets/Project_Images/polyglot.png";
import triva from "../assets/Project_Images/trivia.png";
import toptech from "../assets/Project_Images/toptech.png";
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
      title: "MicroMobile",
      description: "A full-stack micro-mobility vehicle rental platform",
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
    {
      title: "PantryTracker",
      description:
        "A Full-Stack AI pantry management and recipe suggestion app",
      technologies: ["JavaScript", "Next.js", "Gemini API", "Firebase"],
      image: PantryTracker,
      imageType: "banner",
    },
    {
      title: "Capfinity",
      description: "Backtracking algorithm based USA car sales",
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
      title: "PolyGlot",
      description: "Backtracking algorithm based USA car sales",
      technologies: [
        "Python",
        "Matplotlib",
        "Jupyter Notebook",
        "Pandas",
        "NumPy",
      ],
      image: PolyGlot,
      imageType: "logo",
    },
    {
      title: "TriviaNight",
      description: "Collaborative trivia game platform with real-time updates",
      technologies: ["C", "Socket Programming", "TCP/IP"],
      image: triva,
      imageType: "logo",
    },
    {
      title: "TopTechChats",
      description: "Collaborative trivia game platform with real-time updates",
      technologies: [
        "React",
        "TypeScript",
        "Gemini API",
        "Next.js",
        "Tailwind CSS",
        "shadcn",
        "supabase",
        "Alpha Vantage API",
      ],
      image: toptech,
      imageType: "banner",
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title">My Projects</h2>
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
