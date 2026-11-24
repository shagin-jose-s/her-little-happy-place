import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  Gamepad2,
  Brain,
  Heart,
  Zap,
  Trophy,
  ArrowUpRight,
  Orbit,
  WandSparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

import "./PlayGarden.css";

const games = [
  {
    id: 1,
    title: "Starfall Rescue",
    subtitle: "Catch the falling stars",
    description:
      "A little cosmic adventure. Catch glowing stars, avoid dark matter and build your combo.",
    category: "REFLEX GAME",
    icon: Star,
    route: "/play/catch",
    number: "01",
    color: "pink",
    tag: "FAST PACED",
  },
  {
    id: 2,
    title: "Memory Universe",
    subtitle: "Remember the magic",
    description:
      "Find matching pairs hidden inside a dreamy universe. Every level gets a little harder.",
    category: "MEMORY GAME",
    icon: Brain,
    route: "/play/memory",
    number: "02",
    color: "purple",
    tag: "BRAIN POWER",
  },
  {
    id: 3,
    title: "Heartbeat Rhythm",
    subtitle: "Feel the perfect moment",
    description:
      "Follow the rhythm, watch the pulse and tap at exactly the right moment.",
    category: "RHYTHM GAME",
    icon: Heart,
    route: "/play/emoji",
    number: "03",
    color: "blue",
    tag: "TIMING TEST",
  },
  {
    id: 4,
    title: "Dream Maze",
    subtitle: "Find your way home",
    description:
      "Explore a mysterious maze, collect tiny stars and discover the hidden exit.",
    category: "PUZZLE GAME",
    icon: Orbit,
    route: "/play/tictactoe",
    number: "04",
    color: "orange",
    tag: "MYSTERY",
  },
];

const floatingIcons = [
  { Icon: Star, className: "float-one" },
  { Icon: Sparkles, className: "float-two" },
  { Icon: Heart, className: "float-three" },
  { Icon: Zap, className: "float-four" },
  { Icon: Orbit, className: "float-five" },
];

const PlayGarden = () => {
  return (
    <main className="play-garden-page">
      <div className="arcade-background">
        <div className="arcade-orb orb-one" />
        <div className="arcade-orb orb-two" />
        <div className="arcade-grid" />

        {floatingIcons.map(({ Icon, className }, index) => (
          <motion.div
            key={index}
            className={`arcade-floating-icon ${className}`}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 12, -12, 0],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={22} />
          </motion.div>
        ))}
      </div>

      <div className="play-garden-content">
        <BackButton fallback="/" />

        <motion.section
          className="arcade-hero"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="arcade-eyebrow">
            <WandSparkles size={15} />
            <span>THE LITTLE HAPPY ARCADE</span>
            <span className="eyebrow-dot" />
          </div>

          <h1>
            Enter the
            <br />
            <span>Play Universe.</span>
          </h1>

          <p>
            Four little worlds. Endless little adventures.
            <br />
            Ready to create some happy memories?
          </p>

          <div className="arcade-hero-stats">
            <div>
              <Gamepad2 size={17} />
              <span>04 Worlds</span>
            </div>

            <div>
              <Sparkles size={17} />
              <span>Endless Fun</span>
            </div>

            <div>
              <Heart size={17} />
              <span>Made with Love</span>
            </div>
          </div>
        </motion.section>

        <section className="arcade-section">
          <div className="arcade-section-heading">
            <div>
              <span className="arcade-section-label">CHOOSE YOUR ADVENTURE</span>
              <h2>
                Your next <span>little obsession.</span>
              </h2>
            </div>

            <div className="arcade-live-status">
              <span />
              ARCADE ONLINE
            </div>
          </div>

          <div className="arcade-game-grid">
            {games.map((game, index) => {
              const Icon = game.icon;

              return (
                <motion.div
                  key={game.id}
                  className={`arcade-game-card ${game.color}`}
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.12,
                    duration: 0.6,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.015,
                  }}
                >
                  <div className="game-card-top">
                    <span className="game-number">{game.number}</span>
                    <span className="game-tag">{game.tag}</span>
                  </div>

                  <div className="game-icon-stage">
                    <div className="game-icon-ring ring-one" />
                    <div className="game-icon-ring ring-two" />

                    <motion.div
                      className="game-main-icon"
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon size={42} strokeWidth={1.7} />
                    </motion.div>
                  </div>

                  <div className="game-card-info">
                    <span className="game-category">{game.category}</span>

                    <h3>{game.title}</h3>

                    <h4>{game.subtitle}</h4>

                    <p>{game.description}</p>
                  </div>

                  <Link to={game.route} className="game-launch-btn">
                    <span>Enter World</span>
                    <ArrowUpRight size={18} />
                  </Link>

                  <div className="game-card-glow" />
                </motion.div>
              );
            })}
          </div>
        </section>

        <motion.section
          className="arcade-bottom-banner"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="banner-icon">
            <Trophy size={29} />
          </div>

          <div className="banner-content">
            <span>YOUR LITTLE MISSION</span>
            <h3>Collect smiles, not just points.</h3>
            <p>
              Every adventure is better when you enjoy the little moments.
            </p>
          </div>

          <div className="banner-decoration">
            <Sparkles size={50} />
          </div>
        </motion.section>

        <footer className="arcade-footer">
          <span>✦</span>
          MADE WITH A LITTLE EXTRA LOVE
          <span>✦</span>
        </footer>
      </div>
    </main>
  );
};

export default PlayGarden;