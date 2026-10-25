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
      <SectionDivider label="About Me" code="// entering about-me.sys" />
      <About />
      <SectionDivider label="Experience" code="// loading experience.log" />
      <Experience />
      <SectionDivider label="Skills" code="// mounting skills.db" />
      <Skill />
      <SectionDivider label="Projects" code="// deploying projects.build" />
      <Projects />
    </div>
  );
}

export default App;
