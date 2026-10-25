// App.jsx
import React from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects";
import "./App.css";
import Skill from "./components/Skills.jsx";
import SectionDivider from "./components/SectionDivider";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Home />
      <SectionDivider section="about" label="About Me" code="// entering about-me.sys" />
      <About />
      <SectionDivider section="experience" label="Experience" code="// loading experience.log" />
      <Experience />
      <SectionDivider section="skills" label="Skills" code="// mounting skills.db" />
      <Skill />
      <SectionDivider section="projects" label="Projects" code="// deploying projects.build" />
      <Projects />
    </div>
  );
}

export default App;
