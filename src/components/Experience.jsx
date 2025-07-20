// Experience.jsx
import React from "react";
import { motion } from "framer-motion";
import "../App.css";
import blueprint from "../assets/blueprint.jpeg";
import mitre from "../assets/mitre.jpeg";
import proof from "../assets/ProOF.jpeg";
import msa from "../assets/msa.jpeg";
import headstarter from "../assets/headstarter.jpeg";

const experiences = [
  {
    title: "Vice President of Recruitment",
    company: "Blueprint",
    years: "Apr 2025 - Present",
    location: "Hoboken, NJ",
    stack: ["Leadership", "Recruitment", "Communication"],
    logo: blueprint,
  },
  {
    title: "Software Engineer Intern",
    company: "MITRE",
    years: "Jun 2025 - Aug 2025",
    location: "Bedford, MA",
    stack: ["Python", "Ubuntu", "AFSIM"],
    logo: mitre,
  },
  {
    title: "Software Developer ",
    company: "Blueprint",
    years: "Sep 2024 - May 2024",
    location: "Hoboken, NJ",
    stack: ["React", "Java", "JavaScript"],
    logo: blueprint,
  },
  {
    title: "Software Engineering Fellow ",
    company: "Headstarter AI",
    years: "Jul 2024 - Sep 2024",
    location: "Remote",
    stack: ["React", "Next.js", "Firebase", "Gemini/OpenAI API"],
    logo: headstarter,
  },

  {
    title: "ML Researcher",
    company: "ProOF Lab",
    years: "May 2024 - August 2024",
    stack: ["Python", "Google Colab", "Meshlab"],
    location: "Remote",
    logo: proof,
  },
  {
    title: "Brotherhood Chair",
    company: "Muslim Student Association",
    years: "April 2024 - Present",
    location: "Hoboken, NJ",
    stack: ["Leadership", "Community Building", "Event Planning"],
    logo: msa,
  },
  {
    title: "Software Engineer Intern",
    company: "ProOF Lab",
    years: "September 2024 - May 2024",
    location: "Hoboken, NJ",
    stack: ["Python", "Flask", "Boostrap"],
    logo: proof,
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
            <img
              src={exp.logo}
              alt={`${exp.company} logo`}
              className="company-logo"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "25%",
                marginBottom: "10px",
              }}
            />
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
