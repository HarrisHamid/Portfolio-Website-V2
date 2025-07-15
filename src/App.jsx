// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavBar from "./components/NavBar";

import "./App.css";

function App() {
  return (
    <Router>
      {" "}
      {/* Wrap your entire app with Router */}
      <div className="App">
        <NavBar />{" "}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
