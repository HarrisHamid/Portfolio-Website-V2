// App.jsx
import React from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import "./App.css";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Home />
      <About />
      <Experience />
      <Projects />
    </div>
  );
}

export default App;
