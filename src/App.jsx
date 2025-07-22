// App.jsx
import React from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects";
import "./App.css";
import Skill from "./components/Skills.jsx";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Home />
      <About />
      <Experience />
      <Skill />
      <Projects />
    </div>
  );
}

export default App;
