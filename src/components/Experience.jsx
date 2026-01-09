// Experience.jsx
import React from "react";
import { motion } from "framer-motion";
import "../App.css";
import blueprint from "../assets/Experience_Photos/blueprint.jpeg";
import mitre from "../assets/Experience_Photos/MITRE.jpeg";
import proof from "../assets/Experience_Photos/ProOF.jpeg";
import msa from "../assets/Experience_Photos/msa.jpeg";
import headstarter from "../assets/Experience_Photos/headstarter.jpeg";
import perplex from "../assets/Experience_Photos/perplexity.jpeg";
import stevens from "../assets/Experience_Photos/stevens.jpeg";
import spike from "../assets/Experience_Photos/293spike.png";
import nomad from "../assets/Experience_Photos/nomad.jpeg";

const experiences = [
  {
    title: "Platform Software Engineer Intern",
    company: "Nomad Futurist",
    years: "Dec 2025 - Present",
    location: "Remote",
    stack: ["PHP", "MySQL"],
    logo: nomad,
  },
  {
    title: "Vice President of Recruitment",
    company: "Blueprint",
    years: "Apr 2025 - Present",
    location: "Hoboken, NJ",
    stack: ["Leadership", "Recruitment", "Communication"],
    logo: blueprint,
  },
  {
    title: "Campus Partner",
    company: "Perplexity",
    years: "Sept 2025 - Dec 2025",
    location: "Hoboken, NJ",
    stack: ["Marketing", "Sales"],
    logo: perplex,
  },
  {
    title: "Teaching Assistant/Course Assistant",
    company: "Stevens Institute of Technology",
    years: "Sep 2025 - Present",
    location: "Hoboken, NJ",
    stack: ["C++", "Teaching"],
    logo: stevens,
  },
  {
    title: "Software Engineer Intern",
    company: "MITRE",
    years: "Jun 2025 - Aug 2025",
    location: "Bedford, MA",
    stack: ["Python", "Linux", "AFSIM", "GitLab"],
    logo: mitre,
  },
  {
    title: "Software Developer ",
    company: "Blueprint",
    years: "Sep 2023 - May 2024",
    location: "Hoboken, NJ",
    stack: ["React.js", "Tailwind CSS", "JavaScript", "TypeScript"],
    logo: blueprint,
  },
  {
    title: "Software Engineering Fellow ",
    company: "Headstarter AI",
    years: "Jul 2024 - Sep 2024",
    location: "Remote",
    stack: ["React", "JavaScript", "Next.js", "Firebase", "Gemini/OpenAI API"],
    logo: headstarter,
  },

  {
    title: "Machine Learning Researcher",
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
    years: "Oct 2023 - May 2024",
    location: "Hoboken, NJ",
    stack: ["Python", "Flask", "Bootstrap", "SQLite", "SQLAlchemy"],
    logo: proof,
  },
  {
    title: "Developer & Co-Driver",
    company: "FRC Team 293 Spike",
    years: "Oct 2018 - May 2022",
    location: "Pennington, NJ",
    stack: ["Java", "Electronics", "Machining"],
    logo: spike,
  },
];

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="timeline-container">
        <div className="section-title-time">
          <h2>
            <span></span>Experience<span></span>
          </h2>
        </div>{" "}
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
