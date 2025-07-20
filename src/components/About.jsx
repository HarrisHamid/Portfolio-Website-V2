import React from "react";
import profilePic from "../assets/profile.png";
import "../App.css";
import ufcpic from "../assets/ufc_bw.png";
import f1long from "../assets/f1long.png";
import guitar from "../assets/guitar.png";
import climbing from "../assets/rc.jpg";
import karate from "../assets/karate.png";
import SchoolIcon from "@mui/icons-material/School";
import Stevens from "../assets/sit.jpg";

const About = () => (
  <section id="about" className="about-section">
    <div className="container">
      <div className="section-title">
        <h2>
          <span></span>About Me<span></span>
        </h2>
      </div>
      <div className="row align-self-center about-content-row">
        <div className="col-lg-8 content align-self-center">
          <div className="about-info-paragraph-minimal">
            {/* Education Section */}
            <div className="education-section-minimal">
              <h3 className="section-heading">🎓 Education</h3>
              <div className="education-content-minimal">
                <div className="education-left-bar"></div>
                <div className="education-details-minimal">
                  <h4>Bachelor of Computer Science</h4>
                  <p className="university-name">
                    Stevens Institute of Technology
                  </p>
                  <p className="year-range">2022 - 2026</p>
                  {/* <p className="description">
                    Undergraduate Computer Science Major specializing in
                    Software Engineering. Currently a rising senior passionate
                    about technology and building innovative solutions.
                  </p> */}
                </div>
                <div className="education-image">
                  {/* <img src={Stevens} alt="Stevens Institute of Technology" /> */}
                </div>
              </div>
            </div>

            {/* Clubs/Organizations Section */}
            <div className="organizations-section-minimal">
              <h3 className="section-heading">🏢 Clubs / Organizations</h3>
              <div className="organizations-content-minimal">
                <div className="organizations-left-bar"></div>
                <div className="organizations-list-minimal">
                  <div className="org-item">
                    • Vice President of Recruitment @ Blueprint
                  </div>
                  <div className="org-item">
                    • Brotherhood Chair @ Muslim Student Association
                  </div>
                  <div className="org-item">
                    • Member of Sigma Phi Epsilon (Σ Φ Ε)
                  </div>
                </div>
              </div>
            </div>

            {/* Hobbies Section */}
            <div className="hobbies-section-minimal">
              <h3 className="section-heading">🚀 Hobbies and Interests</h3>
              <div className="hobbies-horizontal">
                <div className="hobby-item-horizontal">
                  <img src={f1long} alt="Formula 1" />
                </div>
                <div className="hobby-item-horizontal">
                  <img src={ufcpic} alt="UFC" />
                </div>
                <div className="hobby-item-horizontal">
                  <img src={karate} alt="Karate" />
                </div>
                <div className="hobby-item-horizontal">
                  <img src={climbing} alt="Rock Climbing" />
                </div>
              </div>
            </div>

            {/* <p className="aboutBio-minimal">
              I'm a rising senior who's passionate about technology. I enjoy
              building whether with software or hardware.
            </p> */}
          </div>
        </div>
        <div className="col-lg-4 d-flex justify-content-center order-lg-last">
          <img src={profilePic} alt="Profile" className="headshot" />
        </div>
      </div>
    </div>
  </section>
);

export default About;
