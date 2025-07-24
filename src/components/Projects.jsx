import React from "react";
import "../App.css";
import Micromobile from "../assets/Project_Images/Micromobile.png";
import PantryTracker from "../assets/Project_Images/PantryTracker.png";
import capfinity from "../assets/Project_Images/capfinity.png";
import PolyGlot from "../assets/Project_Images/polyglot.png";
import triva from "../assets/Project_Images/Trivia.png";
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
    {
      title: "PantryTracker",
      description: "Full-stack AI pantry management and recipe suggestion app",
      technologies: ["JavaScript", "Next.js", "Gemini API", "Firebase"],
      image: PantryTracker,
      imageType: "banner",
    },
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
      title: "PolyGlot - HackPrinceton",
      description:
        "Full-Stack interactive language learning tool that helps you learn Cherokee through short bilingual texts, authentic audio, and instant word translation",
      technologies: ["React", "JavaScript", "FastAPI", "MongoDB", "Python"],
      image: PolyGlot,
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
    {
      title: "TopTechChats",
      description:
        "Full-Stack AI chatbot and news aggregator for top 10 tech companies",
      technologies: [
        "React",
        "TypeScript",
        "Gemini API",
        "Next.js",
        "Tailwind CSS",
        "Shadcn",
        "Alpha Vantage API",
      ],
      image: toptech,
      imageType: "banner",
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="section-title">
        <h2>
          <span></span>Projects<span></span>
        </h2>
      </div>{" "}
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
