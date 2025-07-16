import React, { useState, useEffect } from "react";
import "../../src/App.css";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import profilepicture from "../assets/profile.png";
import PixelAnimation from "./PixelAnimation";

const Home = () => {
  const [typedText, setTypedText] = useState("");
  const phrases = ["Developer", "Life Long Learner", "Tech Bro"];
  const sleepTime = 100;

  // Typewriter effect
  useEffect(() => {
    let currentPhraseIndex = 0;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const writeLoop = async () => {
      while (true) {
        let currentWord = phrases[currentPhraseIndex];

        for (let i = 0; i < currentWord.length; i++) {
          setTypedText(currentWord.substring(0, i + 1));
          await sleep(sleepTime);
        }

        await sleep(sleepTime * 10);

        for (let i = currentWord.length; i > 0; i--) {
          setTypedText(currentWord.substring(0, i - 1));
          await sleep(sleepTime);
        }
        await sleep(sleepTime * 5);
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }
    };

    writeLoop();

    return () => {};
  }, []);

  return (
    <section className="home" id="home">
      <PixelAnimation />
      <div className="home-content">
        <h1>
          Hi, I'm <span className="highlight-red">Harris Hamid</span>
        </h1>

        <div className="container-typewriter">
          <h3>
            {" "}
            I'm a <span id="typewriter">{typedText}</span>
            <span id="cursor">|</span>
          </h3>
        </div>

        <p>
          My passions lie in both the tech and finance industries. <br />I am
          always looking for new opportunities to enhance my skill set and work
          on new projects.
        </p>

        <div className="btn-group">
          <div className="social-icons">
            <a
              href="https://github.com/HarrisHamid"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="social-icon" />
            </a>
            <a
              href="https://www.linkedin.com/in/hhamid26/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="social-icon" />
            </a>
          </div>
          <a
            href="resume.pdf"
            id="resume"
            className="btn"
            download="Harris_Hamid_Resume.pdf"
          >
            Resume
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
