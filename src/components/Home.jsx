import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../../src/App.css";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Home = () => {
  const [typedText, setTypedText] = useState("");
  const phrases = ["Developer", "Life Long Learner", "Tech Enthusiast "];
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

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  // --- Memoize Particles Options ---
  const particlesOptions = useMemo(() => {
    return {
      particles: {
        number: {
          value: 30,
          density: {
            enable: true,
            value_area: 280,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 10,
            line_linked: {
              opacity: 1,
            },
          },
        },
      },
      retina_detect: true,
      background: {
        color: {
          value: "#1a1a1a",
        },
      },
    };
  }, []);

  return (
    <section className="home" id="home">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
      />

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
      <div className="home-img">
        <div className="profile-picture-placeholder"></div>
      </div>
    </section>
  );
};

export default Home;
