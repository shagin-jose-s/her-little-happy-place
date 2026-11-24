import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowDown,
  ArrowRight,
  Sparkles,
  Heart,
  Stars,
  Orbit,
  Zap,
  Gift,
  Gamepad2,
} from "lucide-react";

import { Link } from "react-router-dom";

import ActivityCard from "../components/ActivityCard";

import { activities } from "../data/activities";

import "./Home.css";

const surprises = [
  {
    title: "A tiny reminder 💗",
    message:
      "You don't have to make every day perfect. Sometimes one little happy moment is enough.",
  },
  {
    title: "A secret wish 🌙",
    message:
      "I hope something beautiful finds its way into your day. Even if it's something very small.",
  },
  {
    title: "One little fact ✨",
    message:
      "There is only one you in this entire universe. That's already something special.",
  },
  {
    title: "A virtual hug 🧸",
    message:
      "Imagine a giant fluffy hug arriving right now. No explanation needed.",
  },
  {
    title: "Your mission 🌸",
    message:
      "Find one thing today that makes you smile. Mission accepted?",
  },
];

const floatingItems = [
  { symbol: "✦", className: "hero-star star-one" },
  { symbol: "✧", className: "hero-star star-two" },
  { symbol: "♡", className: "hero-heart heart-one" },
  { symbol: "✦", className: "hero-star star-three" },
  { symbol: "♡", className: "hero-heart heart-two" },
  { symbol: "✧", className: "hero-star star-four" },
];

export default function Home() {
  const [surprise, setSurprise] = useState(null);

  const revealSurprise = () => {
    const nextIndex = Math.floor(
      Math.random() * surprises.length
    );

    setSurprise(surprises[nextIndex]);
  };

  const scrollToActivities = () => {
    document.getElementById("activity-universe")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section className="home-hero">

        <div className="hero-background-grid" />

        <div className="hero-content">

          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles size={15} />

            <span>WELCOME TO YOUR LITTLE UNIVERSE</span>

            <Sparkles size={15} />
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
          >
            A little place
            <br />

            <span>for big smiles.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.45,
            }}
          >
            Somewhere between the stars and your imagination,
            there's a tiny universe made to brighten your day.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.65,
            }}
          >
            <button
              className="hero-primary-button"
              onClick={scrollToActivities}
            >
              Explore your universe

              <ArrowRight size={19} />
            </button>

            <Link
              to="/play"
              className="hero-secondary-button"
            >
              <Gamepad2 size={18} />

              Play something
            </Link>
          </motion.div>

          <motion.div
            className="hero-bottom-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.2,
            }}
          >
            <Heart size={14} fill="currentColor" />

            <span>CREATED WITH A LITTLE EXTRA LOVE</span>
          </motion.div>

        </div>

        {/* GALAXY ARTWORK */}

        <div className="hero-universe">

          <div className="universe-aura aura-one" />
          <div className="universe-aura aura-two" />

          <div className="universe-orbit orbit-large">
            <div className="orbit-planet planet-one" />
          </div>

          <div className="universe-orbit orbit-medium">
            <div className="orbit-planet planet-two" />
          </div>

          <div className="universe-orbit orbit-small">
            <div className="orbit-planet planet-three" />
          </div>

          <div className="hero-moon">
            <div className="hero-moon-shadow" />
          </div>

          <div className="universe-center">

            <div className="universe-center-ring">
              <Stars size={45} />
            </div>

            <div className="universe-center-heart">
              <Heart size={38} fill="currentColor" />
            </div>

          </div>

          {floatingItems.map((item, index) => (
            <span
              key={index}
              className={item.className}
            >
              {item.symbol}
            </span>
          ))}

          <div className="universe-caption">
            <span className="caption-line" />

            <span>YOUR OWN LITTLE GALAXY</span>

            <span className="caption-line" />
          </div>

        </div>

        <button
          className="hero-scroll-indicator"
          onClick={scrollToActivities}
          aria-label="Scroll to activities"
        >
          <span>SCROLL TO EXPLORE</span>

          <ArrowDown size={17} />
        </button>

      </section>

      {/* LITTLE REMINDER */}

      <section className="home-reminder-section">

        <motion.div
          className="reminder-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >

          <div className="reminder-icon">
            <Sparkles size={27} />
          </div>

          <div className="reminder-content">

            <span>A LITTLE REMINDER</span>

            <h3>
              You don't have to do anything big today.
              Just find one tiny reason to smile.
            </h3>

          </div>

          <div className="reminder-decoration">
            ✦
          </div>

        </motion.div>

      </section>

      {/* ACTIVITY UNIVERSE */}

      <section
        className="activity-universe-section"
        id="activity-universe"
      >

        <div className="activity-section-header">

          <div>

            <div className="section-eyebrow">
              <Orbit size={15} />

              <span>EXPLORE THE DIMENSIONS</span>
            </div>

            <h2 className="activity-main-title">
              Choose your
              <span> next adventure.</span>
            </h2>

            <p className="activity-section-description">
              Six little worlds. Each with something different
              waiting for you.
            </p>

          </div>

          <div className="activity-header-decoration">
            <Stars size={38} />
          </div>

        </div>

        <div className="activity-grid">

          {activities.map((activity, index) => (

            <motion.div
              key={activity.id}
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
            >

              <ActivityCard
                title={activity.title}
                description={activity.description}
                icon={activity.icon}
                number={activity.number}
                tag={activity.tag}
                path={activity.path}
                theme={activity.theme}
              />

            </motion.div>

          ))}

        </div>

      </section>

      {/* SURPRISE PORTAL */}

      <section className="surprise-section">

        <div className="surprise-panel">

          <div className="surprise-decoration surprise-decoration-one">
            ✦
          </div>

          <div className="surprise-decoration surprise-decoration-two">
            ♡
          </div>

          <div className="surprise-icon">
            <Gift size={34} />
          </div>

          <span className="surprise-eyebrow">
            A LITTLE SOMETHING FOR YOU
          </span>

          <h2>
            Curious what's
            <br />
            <span>inside the universe?</span>
          </h2>

          <p>
            There's always a little surprise waiting.
            Shall we discover it?
          </p>

          <button
            className="surprise-button"
            onClick={revealSurprise}
          >
            <Sparkles size={18} />

            Reveal a surprise

            <Zap size={17} />
          </button>

          <AnimatePresence mode="wait">

            {surprise && (

              <motion.div
                key={surprise.title}
                className="surprise-result"
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.45,
                }}
              >

                <div className="surprise-result-icon">
                  ✨
                </div>

                <h3>{surprise.title}</h3>

                <p>{surprise.message}</p>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="home-footer">

        <div className="footer-logo">
          <Sparkles size={19} />

          <span>little happy place</span>
        </div>

        <p>
          A tiny universe, made of little moments.
        </p>

        <div className="footer-heart">
          MADE WITH <Heart size={12} fill="currentColor" /> LOVE
        </div>

      </footer>

    </div>
  );
}