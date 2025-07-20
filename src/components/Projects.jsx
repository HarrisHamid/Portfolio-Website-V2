import React from "react";
import "../App.css";

const ProjectCard = ({
  title = "E-commerce Platform",
  description = "A full-stack e-commerce solution with modern UI and seamless shopping experience",
  technologies = ["React", "Node.js", "MongoDB", "Express"],
}) => {
  return (
    <div className="project-card">
      <div className="project-header">
        {/* Purple gradient background area */}
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
      description: "A full-stack micro-mobility vechicle sharing platform",
      technologies: [
        "JavaScript",
        "Node.js",
        "MongoDB",
        "Express.js",
        "Bootstrap",
        "Handlebars",
      ],
    },
    {
      title: "TriviaNight",
      description: "Collaborative trivia game platform with real-time updates",
      technologies: ["C", "Socket Programming", "TCP/IP"],
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
    },
    {
      title: "PantryTracker",
      description: "Backtracking algorithm based USA car sales",
      technologies: ["JavaScript", "Next.js", "Gemini API"],
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
    },
    {
      title: "AI Customer Support Bot",
      description: "Backtracking algorithm based USA car sales",
      technologies: ["JavaScript", "Next.js", "OpenAI API"],
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="section-title">
        <h2>Projects</h2>
      </div>
      <div className="projects-showcase">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsShowcase;
