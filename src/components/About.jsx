import React from "react";
import profilePic from "../assets/profile.png";

const About = () => (
  <section id="about" className="about-section">
    <h2>About Me</h2>
    <div className="headshot">
      <img src={profilePic} alt="Harris Hamid"></img>
    </div>
  </section>
);

export default About;
