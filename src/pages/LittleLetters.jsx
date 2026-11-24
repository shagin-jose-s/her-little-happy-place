import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  Mail,
  Heart,
  Lock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Stars,
} from "lucide-react";

import { littleLetters } from "../data/messages";

import BackButton from "../components/BackButton";

import "./LittleLetters.css";

export default function LittleLetters() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [openedLetters, setOpenedLetters] = useState([]);

  const openLetter = (letter) => {
    setSelectedLetter(letter);

    setOpenedLetters((previous) =>
      previous.includes(letter.id)
        ? previous
        : [...previous, letter.id]
    );
  };

  const closeLetter = () => {
    setSelectedLetter(null);
  };

  return (
    <div className="letters-page page-container">

      <BackButton fallback="/" showHome />

      {/* HEADER */}

      <header className="letters-header animate-page-reveal">

        <div className="letters-eyebrow">
          <Stars size={16} />
          THE SECRET LETTER ROOM
        </div>

        <h1>
          Little words,
          <br />
          <span>big feelings.</span>
        </h1>

        <p>
          Somewhere in this little room, a few messages are
          waiting to be discovered. Open one whenever you like.
        </p>

        <div className="letters-progress">

          <div className="letters-progress-icon">
            <Mail size={18} />
          </div>

          <div className="letters-progress-text">
            <strong>
              {openedLetters.length} / {littleLetters.length}
            </strong>

            <span>Letters discovered</span>
          </div>

          <div className="letters-progress-track">
            <div
              className="letters-progress-fill"
              style={{
                width: `${
                  (openedLetters.length / littleLetters.length) * 100
                }%`,
              }}
            />
          </div>

        </div>

      </header>

      {/* ENVELOPE COLLECTION */}

      <section className="letter-collection">

        <div className="letter-collection-heading">

          <div>
            <span>YOUR LITTLE COLLECTION</span>
            <h2>Choose an envelope.</h2>
          </div>

          <Sparkles size={27} />

        </div>

        <div className="letters-grid">

          {littleLetters.map((letter, index) => {

            const isOpened = openedLetters.includes(letter.id);

            return (

              <motion.button
                key={letter.id}
                className={`letter-card ${
                  isOpened ? "letter-card-opened" : ""
                }`}
                onClick={() => openLetter(letter)}
                whileHover={{
                  y: -9,
                  rotate: index % 2 === 0 ? -2 : 2,
                }}
                whileTap={{ scale: 0.96 }}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                }}
              >

                <div className="letter-card-top">
                  <span>
                    LETTER {String(index + 1).padStart(2, "0")}
                  </span>

                  {isOpened ? (
                    <Heart
                      size={17}
                      fill="currentColor"
                    />
                  ) : (
                    <Lock size={17} />
                  )}
                </div>

                <div className="envelope-illustration">

                  <div className="envelope-shadow" />

                  <div className="envelope-body">
                    <div className="envelope-flap" />

                    <div className="envelope-paper">
                      <Heart size={21} />
                    </div>

                    <div className="envelope-seal">
                      <Heart size={18} fill="currentColor" />
                    </div>
                  </div>

                </div>

                <div className="letter-card-bottom">

                  <h3>{letter.title}</h3>

                  <span>
                    {isOpened ? "OPEN AGAIN" : "TAP TO DISCOVER"}

                    <ArrowRight size={15} />
                  </span>

                </div>

              </motion.button>

            );
          })}

        </div>

      </section>

      {/* LETTER MODAL */}

      <AnimatePresence>

        {selectedLetter && (

          <motion.div
            className="letter-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLetter}
          >

            <motion.div
              className="letter-modal"
              initial={{
                opacity: 0,
                scale: 0.75,
                y: 50,
                rotateX: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 35,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 20,
              }}
              onClick={(event) => event.stopPropagation()}
            >

              <button
                className="letter-modal-close"
                onClick={closeLetter}
                aria-label="Close letter"
              >
                ✕
              </button>

              <div className="letter-modal-decoration">
                ✦
              </div>

              <div className="letter-modal-icon">
                <Mail size={29} />
              </div>

              <span className="letter-modal-eyebrow">
                A LITTLE MESSAGE FOR YOU
              </span>

              <h2>{selectedLetter.title}</h2>

              <div className="letter-modal-divider">
                <span />
                <Heart size={15} fill="currentColor" />
                <span />
              </div>

              <p>{selectedLetter.message}</p>

              <div className="letter-modal-footer">
                <span>WITH A LITTLE EXTRA LOVE</span>
                <Heart size={17} fill="currentColor" />
              </div>

              <button
                className="letter-close-button"
                onClick={closeLetter}
              >
                <RotateCcw size={16} />
                Close this letter
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* FOOTER */}

      <div className="letters-footer">
        <Sparkles size={16} />

        <p>
          Some words are small, but the feelings behind them are beautiful.
        </p>

      </div>

    </div>
  );
}