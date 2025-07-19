import React from "react";
import profilePic from "../assets/profile.png";
import "../App.css";
import ufcpic from "../assets/ufc_bw.png";
import f1long from "../assets/f1long.png";
import guitar from "../assets/guitar.png"; // Not used in the current image, but kept for completeness
import climbing from "../assets/rc.jpg";
import karate from "../assets/karate.png";
import SchoolIcon from "@mui/icons-material/School"; // Not used in the current image
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
          <div className="about-info-paragraph">
            <div className="two-column-layout">
              {" "}
              {/* New wrapper for the two columns */}
              <div className="education-column">
                <p>
                  <span
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #2a48aa, #00eaff, #2a48aa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                      fontWeight: "bold",
                      padding: "0 5px",
                      fontSize: "1.8rem",
                    }}
                  >
                    🎓 EDUCATION
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    paddingTop: "10px",
                    position: "relative",
                    justifyContent: "flex-start", // Align to start for education
                  }}
                >
                  <img
                    src={Stevens}
                    alt="Stevens Institute of Technology"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "20px",
                      paddingLeft: "10px",
                    }}
                  />
                  <div
                    className="education-details"
                    style={{ textAlign: "left" }}
                  >
                    {" "}
                    {/* Added class and ensured left alignment */}
                    <p style={{ margin: 0 }}>
                      Undergraduate Computer Science Major <br />
                      VP of Recruitment @ Blueprint <br />
                      Brotherhood Coordinator @ MSA <br />Σ Φ Ε
                    </p>
                  </div>
                </div>
              </div>
              <div className="hobbies-column">
                <p className="hobbies-title">🚀 Hobbies and Interests:</p>
                <div className="hobbies-grid">
                  <div className="hobby-item">
                    <img src={f1long} alt="F1" />
                  </div>
                  <div className="hobby-item">
                    <img src={ufcpic} alt="UFC" />
                  </div>
                  <div className="hobby-item">
                    <img src={karate} alt="Karate" />
                  </div>
                  <div className="hobby-item">
                    <img src={climbing} alt="Rock Climbing" />
                  </div>
                </div>
              </div>
            </div>
            <p className="aboutBio">
              Im a rising senior whos passionate about technology. I enjoy
              building whether with software or hardware.
            </p>
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
