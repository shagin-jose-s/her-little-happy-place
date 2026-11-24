import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Clock3,
  Trophy,
  Sparkles,
  RotateCcw,
  Heart,
  Zap,
  Crown,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MemoryMatch.css";

const EMOJIS = [
  "🌙", "⭐", "🦋", "🌸", "💜", "🍓",
  "🪐", "🌈", "🧸", "🍒", "🦄", "💎",
  "🐰", "🎀", "🌻", "🍉", "🪷", "🧁",
];

const LEVELS = [
  { id: 1, name: "Stardust", pairs: 4, time: 45, unlockScore: 0 },
  { id: 2, name: "Moonlight", pairs: 6, time: 60, unlockScore: 80 },
  { id: 3, name: "Galaxy", pairs: 9, time: 90, unlockScore: 180 },
];

const shuffle = (array) => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const createCards = (level) => {
  const selected = EMOJIS.slice(0, level.pairs);

  return shuffle(
    [...selected, ...selected].map((emoji, index) => ({
      id: `${emoji}-${index}-${Math.random()}`,
      emoji,
      matched: false,
    }))
  );
};

const MemoryMatch = () => {
  const navigate = useNavigate();

  const [level, setLevel] = useState(LEVELS[0]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState("ready");
  const [message, setMessage] = useState("Your memory adventure is waiting!");
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem("memory-universe-best") || 0)
  );
  const [completedLevels, setCompletedLevels] = useState(
    () => Number(localStorage.getItem("memory-universe-levels") || 0)
  );

  const lockRef = useRef(false);
  const mismatchTimer = useRef(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const matchesRef = useRef(0);

  const startLevel = useCallback((selectedLevel) => {
    clearTimeout(mismatchTimer.current);
    clearInterval(timerRef.current);

    const newCards = createCards(selectedLevel);

    setLevel(selectedLevel);
    setCards(newCards);
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setCombo(0);
    setScore(0);
    setTimeLeft(selectedLevel.time);
    setMessage("Find the matching pairs!");
    setGameState("playing");

    scoreRef.current = 0;
    matchesRef.current = 0;
    lockRef.current = false;
  }, []);

  const finishLevel = useCallback((won) => {
    clearInterval(timerRef.current);
    clearTimeout(mismatchTimer.current);

    lockRef.current = true;

    if (won) {
      setGameState("won");
      setMessage("You remembered every little star!");

      setCompletedLevels((previous) => {
        const next = Math.max(previous, level.id);
        localStorage.setItem("memory-universe-levels", String(next));
        return next;
      });

      setBestScore((previous) => {
        const next = Math.max(previous, scoreRef.current);
        localStorage.setItem("memory-universe-best", String(next));
        return next;
      });
    } else {
      setGameState("lost");
      setMessage("The universe is full of surprises. Try again!");
    }
  }, [level.id]);

  const handleCardClick = (card) => {
    if (
      gameState !== "playing" ||
      lockRef.current ||
      card.matched ||
      flipped.includes(card.id)
    ) {
      return;
    }

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((previous) => previous + 1);
      lockRef.current = true;

      const first = cards.find((item) => item.id === nextFlipped[0]);
      const second = cards.find((item) => item.id === nextFlipped[1]);

      if (first.emoji === second.emoji) {
        const nextCombo = combo + 1;
        const points = 20 + Math.min(nextCombo * 5, 30);

        setTimeout(() => {
          const updatedCards = cards.map((item) =>
            item.id === first.id || item.id === second.id
              ? { ...item, matched: true }
              : item
          );

          const nextMatches = matchesRef.current + 1;
          const nextScore = scoreRef.current + points;

          matchesRef.current = nextMatches;
          scoreRef.current = nextScore;

          setCards(updatedCards);
          setMatches(nextMatches);
          setScore(nextScore);
          setCombo(nextCombo);
          setFlipped([]);
          setMessage(nextCombo >= 3 ? "Incredible memory streak! 🔥" : "Perfect match! ✨");

          lockRef.current = false;

          if (nextMatches === level.pairs) {
            finishLevel(true);
          }
        }, 400);
      } else {
        setCombo(0);
        setMessage("Not a match. Remember their places!");

        mismatchTimer.current = setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);
          finishLevel(false);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, finishLevel]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(mismatchTimer.current);
    };
  }, []);

  const nextLevel = () => {
    const next = LEVELS.find((item) => item.id === level.id + 1);

    if (next) {
      startLevel(next);
    } else {
      setGameState("complete");
    }
  };

  const selectLevel = (selected) => {
    if (selected.id > completedLevels + 1) return;
    startLevel(selected);
  };

  const gridClass =
    level.pairs === 4
      ? "memory-grid-small"
      : level.pairs === 6
        ? "memory-grid-medium"
        : "memory-grid-large";

  return (
    <main className="memory-page">
      <div className="memory-background">
        <div className="memory-glow memory-glow-one" />
        <div className="memory-glow memory-glow-two" />
        <div className="memory-stars">
          {Array.from({ length: 30 }).map((_, index) => (
            <span
              key={index}
              style={{
                left: `${(index * 31) % 100}%`,
                top: `${(index * 47) % 100}%`,
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="memory-container">
        <header className="memory-topbar">
          <button
            className="memory-back-btn"
            onClick={() => navigate("/play")}
          >
            <ArrowLeft size={17} />
            Arcade
          </button>

          <div className="memory-brand">
            <Brain size={18} />
            MEMORY UNIVERSE
          </div>
        </header>

        <section className="memory-hero">
          <span className="memory-eyebrow">A LITTLE TEST FOR YOUR BRAIN</span>

          <h1>
            Remember the <span>magic.</span>
          </h1>

          <p>
            Every little symbol has a twin.
            <br />
            Can you find all the matching pairs?
          </p>
        </section>

        <section className="memory-level-selector">
          <div className="memory-level-heading">
            <div>
              <span>YOUR JOURNEY</span>
              <h2>Choose your universe</h2>
            </div>

            <div className="memory-progress">
              <Trophy size={15} />
              {completedLevels}/3 COMPLETED
            </div>
          </div>

          <div className="memory-levels">
            {LEVELS.map((item) => {
              const locked = item.id > completedLevels + 1;
              const completed = item.id <= completedLevels;

              return (
                <button
                  key={item.id}
                  className={`memory-level ${
                    level.id === item.id ? "selected" : ""
                  } ${completed ? "completed" : ""} ${
                    locked ? "locked" : ""
                  }`}
                  onClick={() => selectLevel(item)}
                  disabled={locked}
                >
                  <span className="memory-level-number">
                    {completed ? "✓" : `0${item.id}`}
                  </span>

                  <strong>{item.name}</strong>

                  <small>
                    {item.pairs} pairs · {item.time}s
                  </small>

                  {locked && <LockKeyhole size={15} />}
                  {completed && <Crown size={15} />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="memory-game-shell">
          <div className="memory-game-top">
            <div className="memory-current-level">
              <span>NOW EXPLORING</span>
              <strong>{level.name}</strong>
            </div>

            <div className="memory-game-stats">
              <div>
                <Clock3 size={15} />
                <span>{timeLeft}s</span>
              </div>

              <div>
                <Zap size={15} />
                <span>{combo} combo</span>
              </div>

              <div>
                <Sparkles size={15} />
                <span>{score} pts</span>
              </div>
            </div>
          </div>

          <div className="memory-progress-bar">
            <div
              style={{
                width: `${(matches / level.pairs) * 100}%`,
              }}
            />
          </div>

          <div className="memory-progress-label">
            <span>{matches} MATCHED</span>
            <span>{level.pairs} TOTAL PAIRS</span>
          </div>

          <div className="memory-message">
            <Sparkles size={15} />
            {message}
          </div>

          <div className={`memory-card-grid ${gridClass}`}>
            {cards.map((card, index) => {
              const isFlipped =
                flipped.includes(card.id) || card.matched;

              return (
                <motion.button
                  key={card.id}
                  className={`memory-card ${
                    isFlipped ? "flipped" : ""
                  } ${card.matched ? "matched" : ""}`}
                  onClick={() => handleCardClick(card)}
                  disabled={card.matched || gameState !== "playing"}
                  whileHover={
                    !isFlipped && gameState === "playing"
                      ? { scale: 1.04, y: -3 }
                      : {}
                  }
                  whileTap={{ scale: 0.94 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.025 }}
                >
                  <span className="memory-card-inner">
                    <span className="memory-card-back">
                      <Sparkles size={23} />
                      <span>?</span>
                    </span>

                    <span className="memory-card-front">
                      {card.emoji}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="memory-game-footer">
            <div>
              <span>MOVES</span>
              <strong>{moves}</strong>
            </div>

            <div>
              <span>BEST SCORE</span>
              <strong>{bestScore}</strong>
            </div>

            <button
              onClick={() => startLevel(level)}
              className="memory-restart-btn"
            >
              <RotateCcw size={15} />
              Restart
            </button>
          </div>

          <AnimatePresence>
            {(gameState === "ready" ||
              gameState === "won" ||
              gameState === "lost" ||
              gameState === "complete") && (
              <motion.div
                className="memory-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="memory-overlay-content">
                  <div className="memory-result-icon">
                    {gameState === "lost" ? (
                      <Heart size={34} />
                    ) : gameState === "complete" ? (
                      <Crown size={34} />
                    ) : (
                      <Brain size={34} />
                    )}
                  </div>

                  <span className="memory-result-label">
                    {gameState === "complete"
                      ? "UNIVERSE MASTER"
                      : gameState === "won"
                        ? "LEVEL COMPLETED"
                        : gameState === "lost"
                          ? "TIME'S UP"
                          : "WELCOME, LITTLE EXPLORER"}
                  </span>

                  <h2>
                    {gameState === "complete"
                      ? "You conquered the universe!"
                      : gameState === "won"
                        ? "Amazing memory!"
                        : gameState === "lost"
                          ? "One more try?"
                          : "Ready to remember?"}
                  </h2>

                  <p>
                    {gameState === "complete"
                      ? "All three universes are yours. You're a memory superstar!"
                      : gameState === "won"
                        ? `You collected ${score} points in ${moves} moves.`
                        : gameState === "lost"
                          ? "Take a breath and give those little stars another try."
                          : "Find all matching pairs before the timer runs out."}
                  </p>

                  {gameState === "ready" && (
                    <button
                      onClick={() => startLevel(LEVELS[0])}
                      className="memory-primary-btn"
                    >
                      Start Adventure
                      <Sparkles size={17} />
                    </button>
                  )}

                  {gameState === "won" && level.id < 3 && (
                    <button
                      onClick={nextLevel}
                      className="memory-primary-btn"
                    >
                      Explore Next Level
                      <Sparkles size={17} />
                    </button>
                  )}

                  {(gameState === "lost" || gameState === "won") &&
                    level.id === 3 && (
                      <button
                        onClick={() => setGameState("complete")}
                        className="memory-primary-btn"
                      >
                        Finish Journey
                        <Trophy size={17} />
                      </button>
                    )}

                  {gameState === "lost" && (
                    <button
                      onClick={() => startLevel(level)}
                      className="memory-secondary-btn"
                    >
                      <RotateCcw size={16} />
                      Try Again
                    </button>
                  )}

                  {gameState === "complete" && (
                    <button
                      onClick={() => startLevel(LEVELS[0])}
                      className="memory-primary-btn"
                    >
                      Play Again
                      <RotateCcw size={17} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="memory-footer">
          <Heart size={12} fill="currentColor" />
          A LITTLE MEMORY, A LOT OF MAGIC
          <Heart size={12} fill="currentColor" />
        </footer>
      </div>
    </main>
  );
};

export default MemoryMatch;