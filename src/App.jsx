// App.jsx
import React from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects";
import "./App.css";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Home />
      <About />
      <Experience />
      {/* <Experience /> */}
      <Projects />
    </div>
  );
}

export default App;
