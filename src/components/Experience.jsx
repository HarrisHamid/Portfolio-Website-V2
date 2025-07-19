// Experience.jsx
import React from "react";
import { motion } from "framer-motion";
import "../App.css";

const experiences = [
  {
    title: "Vice President of Recruitment",
    company: "Blueprint",
    years: "April 2025 - Present",
    location: "Hoboken, NJ",
    stack: [""],
  },
  {
    title: "Software Engineer Intern",
    company: "MITRE",
    years: "June 2025 - August 2025",
    location: "Bedford, MA",
    stack: ["Python", "Ubuntu", "AFSIM"],
  },
  {
    title: "Software Developer ",
    company: "Blueprint",
    years: "September 2024 - May 2024",
    location: "Hoboken, NJ",
    stack: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "ML Researcher",
    company: "ProOF Lab",
    years: "May 2024 - August 2024",
    stack: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Brotherhood Coordinator",
    company: "Muslim Student Association",
    years: "April 2024 - Present",
    location: "Hoboken, NJ",
    stack: [""],
  },
  {
    title: "Software Engineer Intern",
    company: "ProOF Lab",
    years: "September 2024 - May 2024",
    location: "Hoboken, NJ",
    stack: ["Python", "Flask", "Boostrap"],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="timeline-container">
        <h2 className="timeline-title">EXPERIENCE</h2>
        <div className="timeline-line" />
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            className={`timeline-card ${index % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
          >
            {/* Glowing dot */}
            <div
              className={`glow-dot ${
                index % 2 === 0 ? "top-right" : "top-left"
              }`}
            />

            <h3>{exp.title}</h3>
            <p className="company">{exp.company}</p>
            <p className="details">
              🗓 {exp.years} <br />
              📍 {exp.location} <br />
            </p>
            <div className="tech-stack">
              {exp.stack.map((tech, i) => (
                <span key={i} className="pill">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
