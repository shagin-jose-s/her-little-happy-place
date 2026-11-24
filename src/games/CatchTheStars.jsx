import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Star,
  Sparkles,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Gem,
  Bomb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./CatchTheStars.css";

const GAME_DURATION = 60;
const INITIAL_LIVES = 3;

const randomBetween = (min, max) =>
  Math.random() * (max - min) + min;

const createItem = () => {
  const chance = Math.random();

  let type = "star";

  if (chance > 0.82 && chance <= 0.94) {
    type = "bomb";
  } else if (chance > 0.94) {
    type = "crystal";
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    x: randomBetween(7, 93),
    y: -10,
    speed: randomBetween(0.7, 1.3),
    rotation: randomBetween(-30, 30),
  };
};

const CatchTheStars = () => {
  const navigate = useNavigate();

  const fieldRef = useRef(null);
  const playerRef = useRef(50);
  const itemsRef = useRef([]);
  const activeRef = useRef(false);
  const spawnRef = useRef(0);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(INITIAL_LIVES);
  const comboRef = useRef(0);
  const timeRef = useRef(GAME_DURATION);

  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState("ready");
  const [message, setMessage] = useState("Ready for a little adventure?");
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem("starfall-best-score") || 0);
  });
  const [soundEnabled, setSoundEnabled] = useState(false);

  const updateScore = (value) => {
    scoreRef.current = value;
    setScore(value);
  };

  const updateLives = (value) => {
    livesRef.current = value;
    setLives(value);
  };

  const updateCombo = (value) => {
    comboRef.current = value;
    setCombo(value);
  };

  const updateTime = (value) => {
    timeRef.current = value;
    setTimeLeft(value);
  };

  const finishGame = useCallback(() => {
    activeRef.current = false;
    setGameState("finished");

    const finalScore = scoreRef.current;

    setBestScore((previous) => {
      const next = Math.max(previous, finalScore);
      localStorage.setItem("starfall-best-score", String(next));
      return next;
    });

    setMessage(
      finalScore >= 200
        ? "You're a little star-catching superstar!"
        : "Every little star counts. Try again!"
    );
  }, []);

  const startGame = () => {
    playerRef.current = 50;
    itemsRef.current = [];
    spawnRef.current = 0;
    lastTimeRef.current = 0;

    updateScore(0);
    updateLives(INITIAL_LIVES);
    updateCombo(0);
    updateTime(GAME_DURATION);

    setPlayerX(50);
    setItems([]);
    setMessage("Catch the stars. Avoid the bombs!");
    setGameState("playing");

    activeRef.current = true;
  };

  const pauseGame = () => {
    if (gameState === "playing") {
      activeRef.current = false;
      setGameState("paused");
    } else if (gameState === "paused") {
      activeRef.current = true;
      lastTimeRef.current = 0;
      setGameState("playing");
    }
  };

  const movePlayer = (clientX) => {
    if (!fieldRef.current) return;

    const rect = fieldRef.current.getBoundingClientRect();

    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    const nextX = Math.min(94, Math.max(6, relativeX));

    playerRef.current = nextX;
    setPlayerX(nextX);
  };

  const handlePointerMove = (event) => {
    if (gameState !== "playing") return;
    movePlayer(event.clientX);
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    let animationFrame;

    const loop = (timestamp) => {
      if (!activeRef.current) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = Math.min(timestamp - lastTimeRef.current, 50);
      lastTimeRef.current = timestamp;

      spawnRef.current += delta;

      const spawnInterval = Math.max(
        320,
        720 - (GAME_DURATION - timeRef.current) * 5
      );

      if (spawnRef.current >= spawnInterval) {
        spawnRef.current = 0;
        itemsRef.current.push(createItem());
      }

      let currentLives = livesRef.current;
      let currentScore = scoreRef.current;
      let currentCombo = comboRef.current;

      const playerPosition = playerRef.current;

      const updatedItems = [];

      itemsRef.current.forEach((item) => {
        const nextY = item.y + item.speed * (delta / 16);

        const distance = Math.abs(item.x - playerPosition);

        const caught = nextY >= 84 && nextY <= 96 && distance < 11;

        if (caught) {
          if (item.type === "bomb") {
            currentLives -= 1;
            currentCombo = 0;
            setMessage("Oops! Watch out for those bombs!");
          } else if (item.type === "crystal") {
            currentScore += 50;
            currentCombo += 1;
            setMessage("Rare crystal! +50 points!");
          } else {
            currentScore += 10 + Math.min(currentCombo * 2, 20);
            currentCombo += 1;
            setMessage(currentCombo >= 5 ? "Amazing combo! 🔥" : "Star caught! ✨");
          }

          return;
        }

        if (nextY > 105) {
          if (item.type === "star" || item.type === "crystal") {
            currentCombo = 0;
          }
          return;
        }

        updatedItems.push({ ...item, y: nextY });
      });

      itemsRef.current = updatedItems;

      updateScore(currentScore);
      updateLives(currentLives);
      updateCombo(currentCombo);
      setItems([...updatedItems]);

      if (currentLives <= 0) {
        finishGame();
        return;
      }

      animationFrame = requestAnimationFrame(loop);
      frameRef.current = animationFrame;
    };

    animationFrame = requestAnimationFrame(loop);
    frameRef.current = animationFrame;

    return () => {
      cancelAnimationFrame(animationFrame);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState, finishGame]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      const nextTime = Math.max(0, timeRef.current - 1);
      updateTime(nextTime);

      if (nextTime <= 0) {
        finishGame();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, finishGame]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState !== "playing") return;

      const step = 5;

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();

        const next = Math.max(6, playerRef.current - step);
        playerRef.current = next;
        setPlayerX(next);
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();

        const next = Math.min(94, playerRef.current + step);
        playerRef.current = next;
        setPlayerX(next);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    return () => {
      activeRef.current = false;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const getItemIcon = (type) => {
    if (type === "bomb") return <Bomb size={25} />;
    if (type === "crystal") return <Gem size={25} />;
    return <Star size={27} fill="currentColor" />;
  };

  return (
    <main className="starfall-page">
      <div className="starfall-background">
        <div className="starfall-glow glow-a" />
        <div className="starfall-glow glow-b" />

        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="starfall-tiny-star"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 53) % 100}%`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="starfall-container">
        <div className="starfall-topbar">
          <button
            className="starfall-back"
            onClick={() => navigate("/play")}
          >
            <ArrowLeft size={17} />
            Arcade
          </button>

          <div className="starfall-logo">
            <Sparkles size={17} />
            STARFALL RESCUE
          </div>
        </div>

        <section className="starfall-heading">
          <span className="starfall-label">COSMIC REFLEX CHALLENGE</span>

          <h1>
            Catch the <span>magic.</span>
          </h1>

          <p>
            A sky full of stars is waiting for you.
            <br />
            Catch the good ones. Escape the dark ones.
          </p>
        </section>

        <div className="starfall-dashboard">
          <div className="starfall-stat">
            <span>SCORE</span>
            <strong>{score}</strong>
          </div>

          <div className="starfall-stat">
            <span>TIME</span>
            <strong className={timeLeft <= 10 ? "danger-time" : ""}>
              00:{String(timeLeft).padStart(2, "0")}
            </strong>
          </div>

          <div className="starfall-stat">
            <span>COMBO</span>
            <strong className="combo-number">x{combo}</strong>
          </div>

          <div className="starfall-stat">
            <span>BEST</span>
            <strong>{bestScore}</strong>
          </div>
        </div>

        <div className="starfall-game-shell">
          <div className="starfall-game-header">
            <div className="starfall-lives">
              <span>YOUR LIVES</span>

              <div>
                {Array.from({ length: INITIAL_LIVES }).map((_, index) => (
                  <Heart
                    key={index}
                    size={20}
                    fill={index < lives ? "currentColor" : "transparent"}
                    className={index < lives ? "life-active" : "life-lost"}
                  />
                ))}
              </div>
            </div>

            <div className="starfall-game-controls">
              <button
                onClick={() => setSoundEnabled((previous) => !previous)}
                title="Sound toggle"
              >
                {soundEnabled ? "Sound ON" : "Sound OFF"}
              </button>

              {gameState === "playing" && (
                <button onClick={pauseGame} title="Pause game">
                  <Pause size={15} />
                  Pause
                </button>
              )}
            </div>
          </div>

          <div
            ref={fieldRef}
            className={`starfall-field ${
              gameState === "playing" ? "field-active" : ""
            }`}
            onPointerMove={handlePointerMove}
          >
            <div className="field-stars">
              {Array.from({ length: 15 }).map((_, index) => (
                <span
                  key={index}
                  style={{
                    left: `${(index * 41) % 100}%`,
                    top: `${(index * 29) % 100}%`,
                  }}
                />
              ))}
            </div>

            {items.map((item) => (
              <motion.div
                key={item.id}
                className={`falling-item falling-${item.type}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `rotate(${item.rotation}deg)`,
                }}
              >
                {getItemIcon(item.type)}
              </motion.div>
            ))}

            <motion.div
              className="starfall-player"
              style={{ left: `${playerX}%` }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="player-glow" />
              <div className="player-basket">
                <Sparkles size={28} />
              </div>
              <span>YOU</span>
            </motion.div>

            <AnimatePresence>
              {gameState === "ready" && (
                <motion.div
                  className="starfall-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="overlay-icon">
                    <Star size={35} fill="currentColor" />
                  </div>

                  <h2>Your cosmic adventure awaits.</h2>
                  <p>Move your basket and catch the falling stars.</p>

                  <button onClick={startGame} className="starfall-start-btn">
                    <Play size={18} fill="currentColor" />
                    Start Adventure
                  </button>
                </motion.div>
              )}

              {gameState === "paused" && (
                <motion.div
                  className="starfall-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="overlay-icon">
                    <Pause size={35} />
                  </div>

                  <h2>Take a little break.</h2>
                  <p>Your stars are waiting for you!</p>

                  <button onClick={pauseGame} className="starfall-start-btn">
                    <Play size={18} fill="currentColor" />
                    Continue
                  </button>
                </motion.div>
              )}

              {gameState === "finished" && (
                <motion.div
                  className="starfall-overlay"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="overlay-icon result-icon">
                    <Trophy size={35} />
                  </div>

                  <span className="result-label">ADVENTURE COMPLETE</span>
                  <h2>{score} points!</h2>
                  <p>{message}</p>

                  <div className="result-details">
                    <div>
                      <span>BEST SCORE</span>
                      <strong>{bestScore}</strong>
                    </div>

                    <div>
                      <span>MAX COMBO</span>
                      <strong>x{combo}</strong>
                    </div>
                  </div>

                  <button onClick={startGame} className="starfall-start-btn">
                    <RotateCcw size={17} />
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="starfall-game-footer">
            <div>
              <Star size={15} fill="currentColor" />
              <span>Star +10</span>
            </div>

            <div>
              <Gem size={15} />
              <span>Crystal +50</span>
            </div>

            <div>
              <Bomb size={15} />
              <span>Bomb -1 Life</span>
            </div>
          </div>
        </div>

        <section className="starfall-instructions">
          <div className="instruction-heading">
            <Zap size={18} />
            <h3>How to play</h3>
          </div>

          <div className="instruction-grid">
            <div>
              <span className="instruction-number">01</span>
              <p>Move your basket left and right.</p>
            </div>

            <div>
              <span className="instruction-number">02</span>
              <p>Catch stars and rare crystals.</p>
            </div>

            <div>
              <span className="instruction-number">03</span>
              <p>Avoid bombs and protect your lives.</p>
            </div>
          </div>

          <p className="keyboard-tip">
            <span>KEYBOARD:</span> Use ← → or A / D keys to move.
          </p>
        </section>

        <footer className="starfall-footer">
          MADE WITH <Heart size={12} fill="currentColor" /> AND A LITTLE MAGIC
        </footer>
      </div>
    </main>
  );
};

export default CatchTheStars;