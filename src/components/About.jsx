import React from "react";
import profilePic from "../assets/profile.png"; // Assuming you still want to use a profile picture
import "../App.css"; // Import the CSS file for styling
import ufcpic from "../assets/UFC.png";
import f1 from "../assets/f1.png";

const About = () => (
  <section id="about" className="about-section">
    <div className="container">
      <div className="section-title">
        <h2>
          <span></span>About Me<span></span>
        </h2>
      </div>
      <div className="row align-self-center about-content-row">
        {" "}
        {/* Added about-content-row for flex order */}
        {/* Text content on the left */}
        <div className="col-lg-8 content align-self-center">
          <div className="about-info-paragraph">
            {" "}
            {/* This div now contains both the main paragraph and hobbies */}
            <div className="row pb-4">
              <p>
                {" "}
                {/* Removed text-center from here as it's not needed for the main paragraph within the bordered div */}
                Whata up! I'm Harris Hamid, a rising Senior CS major @ Stevens
                Insittue of Technolgy. I enjoy learning about the Techn Industry
                and learning things. I enjoy building weather with software or
                my limited hardware skills.
              </p>
            </div>
            <div className="hobbies-section">
              {" "}
              {/* Added a new div for hobbies for better styling control */}
              <p className="hobbies-title">
                {" "}
                {/* Added a class for the "Hobbies and Interests" title */}
                Hobbies and Interests:
              </p>
              <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 gy-3 hobbies-grid">
                {" "}
                {/* Added hobbies-grid for potential specific hobby grid styling */}
                <div className="col d-flex justify-content-start hobby-item">
                  {" "}
                  {/* Adjusted to justify-content-start for left alignment */}
                  <img src={f1} alt="F1" />
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <img src={ufcpic} alt="UFC" />
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <span>Karate</span>
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <span>Rock Climbing</span>
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <span>Guitar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Headshot on the right */}
        <div className="col-lg-4 d-flex justify-content-center order-lg-last">
          {" "}
          <img src={profilePic} alt="Profile" className="headshot" />
        </div>
      </div>
    </div>
  </section>
);

export default About;
