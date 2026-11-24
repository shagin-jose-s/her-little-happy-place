import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  Sparkles,
  Smile,
  Laugh,
  Zap,
  Heart,
  RefreshCw,
  Gift,
  WandSparkles,
  Star,
} from "lucide-react";

import {
  happyMessages,
  jokes,
  challenges,
  compliments,
} from "../data/messages";

import BackButton from "../components/BackButton";

import "./SmileStudio.css";

function randomItem(items, previous) {
  if (items.length <= 1) return items[0];

  let next;

  do {
    next = items[Math.floor(Math.random() * items.length)];
  } while (next === previous);

  return next;
}

export default function SmileStudio() {
  const [activeMessage, setActiveMessage] = useState(null);
  const [activeJoke, setActiveJoke] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [activeCompliment, setActiveCompliment] = useState(null);

  const [machineCount, setMachineCount] = useState(0);

  const generateMessage = () => {
    setActiveMessage((previous) =>
      randomItem(happyMessages, previous)
    );

    setMachineCount((count) => count + 1);
  };

  const generateJoke = () => {
    setActiveJoke((previous) =>
      randomItem(jokes, previous)
    );

    setMachineCount((count) => count + 1);
  };

  const generateChallenge = () => {
    setActiveChallenge((previous) =>
      randomItem(challenges, previous)
    );

    setMachineCount((count) => count + 1);
  };

  const generateCompliment = () => {
    setActiveCompliment((previous) =>
      randomItem(compliments, previous)
    );

    setMachineCount((count) => count + 1);
  };

  return (
    <div className="smile-page page-container">

      <BackButton fallback="/" showHome />

      {/* HEADER */}

      <header className="smile-header animate-page-reveal">

        <div className="smile-eyebrow">
          <Sparkles size={16} />
          THE HAPPINESS LABORATORY
        </div>

        <h1>
          Welcome to the
          <br />
          <span>Smile Machine.</span>
        </h1>

        <p>
          Four little machines. Unlimited unexpected moments.
          Choose one and see what happens.
        </p>

        <div className="smile-counter">
          <div className="counter-icon">
            <Heart size={17} fill="currentColor" />
          </div>

          <span>
            {machineCount} happy discoveries made
          </span>
        </div>

      </header>

      {/* MAIN MACHINE */}

      <section className="happiness-machine">

        <div className="machine-heading">
          <div>
            <span className="machine-label">
              MACHINE 01 / 04
            </span>

            <h2>Random Happiness Generator</h2>

            <p>
              No instructions needed. Just press the button.
            </p>
          </div>

          <div className="machine-big-icon">
            <WandSparkles size={32} />
          </div>
        </div>

        <div className="machine-display">

          <div className="machine-orbit machine-orbit-one" />
          <div className="machine-orbit machine-orbit-two" />

          <div className="machine-center">
            <Sparkles size={35} />
          </div>

          <AnimatePresence mode="wait">
            {activeMessage ? (
              <motion.div
                key={activeMessage}
                className="machine-message"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{ duration: 0.45 }}
              >
                <span>A LITTLE MESSAGE FOR YOU</span>
                <p>{activeMessage}</p>
              </motion.div>
            ) : (
              <div className="machine-placeholder">
                <span>✦</span>
                <p>Your little surprise is waiting...</p>
              </div>
            )}
          </AnimatePresence>

        </div>

        <button
          className="smile-action-button"
          onClick={generateMessage}
        >
          <Sparkles size={18} />
          Generate Happiness
          <Zap size={17} />
        </button>

      </section>

      {/* OTHER MACHINES */}

      <section className="smile-machines-section">

        <div className="smile-section-title">
          <span>THE OTHER MACHINES</span>
          <h2>Pick your kind of fun.</h2>
        </div>

        <div className="smile-machines-grid">

          {/* JOKE MACHINE */}

          <motion.article
            className="smile-machine-card joke-machine"
            whileHover={{ y: -6 }}
          >

            <div className="smile-card-top">
              <div className="smile-card-icon">
                <Laugh size={25} />
              </div>

              <span>02 / JOKE MACHINE</span>
            </div>

            <h3>Need a silly laugh?</h3>

            <p>
              Warning: These jokes may be ridiculously funny.
            </p>

            <AnimatePresence mode="wait">
              {activeJoke && (
                <motion.div
                  key={activeJoke.question}
                  className="joke-result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <strong>{activeJoke.question}</strong>
                  <p>{activeJoke.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="smile-card-button"
              onClick={generateJoke}
            >
              <Laugh size={16} />
              Tell me a joke
            </button>

          </motion.article>

          {/* CHALLENGE MACHINE */}

          <motion.article
            className="smile-machine-card challenge-machine"
            whileHover={{ y: -6 }}
          >

            <div className="smile-card-top">
              <div className="smile-card-icon">
                <Zap size={25} />
              </div>

              <span>03 / CHALLENGE MACHINE</span>
            </div>

            <h3>Accept a tiny mission.</h3>

            <p>
              Random little challenges to make your day interesting.
            </p>

            <AnimatePresence mode="wait">
              {activeChallenge && (
                <motion.div
                  key={activeChallenge.title}
                  className="challenge-result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>{activeChallenge.emoji}</div>
                  <strong>{activeChallenge.title}</strong>
                  <p>{activeChallenge.task}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="smile-card-button"
              onClick={generateChallenge}
            >
              <Zap size={16} />
              Give me a mission
            </button>

          </motion.article>

          {/* COMPLIMENT MACHINE */}

          <motion.article
            className="smile-machine-card compliment-machine"
            whileHover={{ y: -6 }}
          >

            <div className="smile-card-top">
              <div className="smile-card-icon">
                <Heart size={25} />
              </div>

              <span>04 / COMPLIMENT MACHINE</span>
            </div>

            <h3>One lovely thought.</h3>

            <p>
              Sometimes a little kindness is all we need.
            </p>

            <AnimatePresence mode="wait">
              {activeCompliment && (
                <motion.div
                  key={activeCompliment}
                  className="compliment-result"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Star size={22} />
                  <p>{activeCompliment}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="smile-card-button"
              onClick={generateCompliment}
            >
              <Heart size={16} />
              Give me a compliment
            </button>

          </motion.article>

        </div>

      </section>

      {/* FOOTER MESSAGE */}

      <div className="smile-footer-note">
        <Sparkles size={17} />

        <p>
          Remember, happiness doesn't always need a reason.
        </p>

        <Heart size={16} />
      </div>

    </div>
  );
}