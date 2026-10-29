// Experience.jsx
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "../App.css";
import Icon from "./Icon";
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
    title: "Software Engineer",
    company: "MITRE",
    years: "Jun 26 - Present",
    location: "Bedford, MA",
    stack: ["Python", "C++", "TypeScript", "NS-3"],
    logo: mitre,
  },
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
    years: "Apr 2025 - Apr 2026",
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
    years: "Sep 2025 - May 2026",
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
    years: "April 2024 - Apr 2026",
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

// One card: slides in from its side, and its logo art drifts slower than the
// card itself while it crosses the viewport (parallax, like a photo behind glass).
const TimelineCard = ({ exp, index, reduceMotion }) => {
  const ref = useRef(null);
  const side = index % 2 === 0 ? "left" : "right";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  const artScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);

  return (
    <motion.article
      ref={ref}
      className={`timeline-card ${side}`}
      style={{ "--row": index + 1 }}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 60, x: side === "left" ? -40 : 40 }
      }
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="timeline-card-art" aria-hidden="true">
        <motion.img
          src={exp.logo}
          alt=""
          style={reduceMotion ? undefined : { y: artY, scale: artScale }}
        />
      </div>
      <div className="timeline-card-wash" aria-hidden="true" />

      <div className="timeline-card-body">
        <div className="timeline-card-top">
          <img
            src={exp.logo}
            alt={`${exp.company} logo`}
            className="company-logo"
          />
          <span className="timeline-card-location">
            <Icon name="pin" /> {exp.location}
          </span>
        </div>

        <p className="timeline-card-date">
          <Icon name="calendar" /> {exp.years}
        </p>
        <h3>{exp.title.trim()}</h3>
        <p className="company">{exp.company}</p>
        <div className="tech-stack">
          {exp.stack.map((tech) => (
            <span key={tech} className="pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

const Experience = () => {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // 0 when the timeline's top reaches mid-screen, 1 when its bottom does, so
  // the diamond sits at the middle of the viewport as you scroll through.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const markerTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="experience" className="experience-section">
      <div className="timeline-container" ref={containerRef}>
        <div className="timeline-line" aria-hidden="true">
          <motion.div
            className="timeline-line-fill"
            style={{ scaleY: progress }}
          />
          <motion.div className="timeline-marker" style={{ top: markerTop }} />
        </div>
        {experiences.map((exp, index) => (
          <TimelineCard
            key={`${exp.company}-${exp.years}`}
            exp={exp}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;
