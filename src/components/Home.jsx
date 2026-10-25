import React, { useState, useEffect, useRef } from "react";
import "../../src/App.css";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import profilepicture from "../assets/profile.png";
import PerspectiveTunnelHero from "./PerspectiveTunnelHero";

const Home = () => {
  const pinRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const phrases = [
    "Developer",
    "CS Grad",
    "Martial Artist",
    "Tech Bro",
    "Life Long Learner",
  ];
  const sleepTime = 100;

  // Typewriterf effect
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
    <section className="home-pin-wrapper" id="home" ref={pinRef}>
      <div className="home">
        <PerspectiveTunnelHero scrollTargetRef={pinRef} />
        <div className="home-content">
          <div className="container-typewriter">
            <h3 className="terminal-prompt">
              <span className="prompt-arrow">&gt;</span>
              I'm a <span id="typewriter">{typedText}</span>
              <span id="cursor" className="terminal-cursor"></span>
            </h3>
          </div>

          {/* <p>Pashion for Tech and Building</p> */}
        </div>
      </div>
    </section>
  );
};

export default Home;
