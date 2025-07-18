import React from "react";
import profilePic from "../assets/profile.png"; // Assuming you still want to use a profile picture
import "../App.css"; // Import the CSS file for styling
import ufcpic from "../assets/ufc_bw.png";
import f1long from "../assets/f1long.png";
import guitar from "../assets/guitar.png";
import climbing from "../assets/rc.jpg";
import karate from "../assets/karate.png";
import SchoolIcon from "@mui/icons-material/School";
import Stevens from "../assets/sit.jpg"; // Assuming you have a Stevens logo image

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
            <div className="row pb-4">
              <p>
                {" "}
                <SchoolIcon fontSize="medium" />{" "}
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
                  }}
                >
                  EDUCATION
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    paddingTop: "10px",
                    position: "center",
                  }}
                >
                  <img
                    src={Stevens}
                    alt="Stevens Institute of Technology"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                  <div>
                    <p style={{ margin: 0 }}>
                      Undergraduate Computer Science Major <br />
                      VP of Recruitment @ Blueprint <br />
                      Brotherhood Coordinator @ MSA
                    </p>
                  </div>
                </div>
              </p>
            </div>
            <div className="hobbies-section">
              <p className="about-main-paragraph">
                🕹 Passion for technology; Building for genuine impact
              </p>
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
                  <img src={f1long} alt="F1" />
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <img src={ufcpic} alt="UFC" />
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <img src={karate} alt="Karate" />
                </div>
                <div className="col d-flex justify-content-start hobby-item">
                  <img src={climbing} alt="Rock Climbing" />
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
