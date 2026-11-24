import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Zap,
  Trophy,
  RotateCcw,
  Play,
  Sparkles,
  Music2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HeartbeatRhythm.css";

const TOTAL_BEATS = 15;

const LEVELS = [
  { name: "Soft Pulse", speed: 1.2, color: "pink" },
  { name: "Fast Heart", speed: 1.8, color: "purple" },
  { name: "Wild Rhythm", speed: 2.5, color: "blue" },
];

const HeartbeatRhythm = () => {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState("ready");
  const [level, setLevel] = useState(0);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [beat, setBeat] = useState(0);
  const [results, setResults] = useState([]);
  const [lastResult, setLastResult] = useState("");
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem("heartbeat-best") || 0)
  );

  const positionRef = useRef(0);
  const directionRef = useRef(1);
  const lastTapRef = useRef(0);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const resultsRef = useRef([]);

  const finishGame = useCallback(() => {
    setGameState("finished");

    const finalScore = scoreRef.current;

    setBestScore((previous) => {
      const next = Math.max(previous, finalScore);
      localStorage.setItem("heartbeat-best", String(next));
      return next;
    });
  }, []);

  const startGame = () => {
    positionRef.current = 0;
    directionRef.current = 1;
    scoreRef.current = 0;
    streakRef.current = 0;
    resultsRef.current = [];

    setPosition(0);
    setDirection(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setBeat(0);
    setResults([]);
    setLastResult("");
    setLevel(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      const speed = LEVELS[level].speed;
      let next = positionRef.current + directionRef.current * speed;

      if (next >= 100) {
        next = 100;
        directionRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        directionRef.current = 1;
      }

      positionRef.current = next;
      setPosition(next);
      setDirection(directionRef.current);
    }, 16);

    return () => clearInterval(interval);
  }, [gameState, level]);

  const handleTap = () => {
    if (gameState !== "playing") return;

    const now = Date.now();

    if (now - lastTapRef.current < 250) return;
    lastTapRef.current = now;

    const distance = Math.abs(positionRef.current - 50);

    let result = "MISS";
    let points = 0;
    let nextStreak = 0;

    if (distance <= 5) {
      result = "PERFECT";
      points = 100;
      nextStreak = streakRef.current + 1;
    } else if (distance <= 13) {
      result = "GOOD";
      points = 50;
      nextStreak = streakRef.current + 1;
    }

    if (nextStreak > 0) {
      points += Math.min(nextStreak * 5, 50);
    }

    const nextScore = scoreRef.current + points;
    scoreRef.current = nextScore;
    streakRef.current = nextStreak;

    const nextResults = [
      ...resultsRef.current,
      { result, points, beat: beat + 1 },
    ];

    resultsRef.current = nextResults;

    setScore(nextScore);
    setStreak(nextStreak);
    setBestStreak((previous) => Math.max(previous, nextStreak));
    setResults(nextResults);
    setLastResult(result);
    setBeat((previous) => previous + 1);

    if (nextResults.length === 5) {
      setLevel(1);
    }

    if (nextResults.length === 10) {
      setLevel(2);
    }

    if (nextResults.length >= TOTAL_BEATS) {
      finishGame();
    }
  };

  const perfectCount = results.filter(
    (item) => item.result === "PERFECT"
  ).length;

  const goodCount = results.filter(
    (item) => item.result === "GOOD"
  ).length;

  const missCount = results.filter(
    (item) => item.result === "MISS"
  ).length;

  return (
    <main className="heartbeat-page">
      <div className="heartbeat-bg">
        <div className="heartbeat-glow heartbeat-glow-one" />
        <div className="heartbeat-glow heartbeat-glow-two" />
        <div className="heartbeat-orbit" />
      </div>

      <div className="heartbeat-container">
        <header className="heartbeat-topbar">
          <button onClick={() => navigate("/play")} className="heartbeat-back">
            <ArrowLeft size={17} />
            Arcade
          </button>

          <span className="heartbeat-brand">
            <Heart size={17} />
            HEARTBEAT RHYTHM
          </span>
        </header>

        <section className="heartbeat-hero">
          <span>FEEL THE MOMENT</span>
          <h1>
            Follow your <strong>heartbeat.</strong>
          </h1>
          <p>
            Wait for the moving pulse to enter the glowing zone.
            <br />
            Tap at the perfect moment!
          </p>
        </section>

        <section className="heartbeat-dashboard">
          <div>
            <span>SCORE</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>STREAK</span>
            <strong>{streak}x</strong>
          </div>
          <div>
            <span>BEATS</span>
            <strong>{beat}/{TOTAL_BEATS}</strong>
          </div>
          <div>
            <span>BEST</span>
            <strong>{bestScore}</strong>
          </div>
        </section>

        <section className="heartbeat-game-shell">
          <div className="heartbeat-level-label">
            <Music2 size={17} />
            <span>{LEVELS[level].name}</span>
            <span className="heartbeat-level-count">
              STAGE {level + 1}/3
            </span>
          </div>

          <div className="heartbeat-progress">
            <div style={{ width: `${(beat / TOTAL_BEATS) * 100}%` }} />
          </div>

          <div className="heartbeat-track-area">
            <div className="heartbeat-zone" />
            <div className="heartbeat-center-line" />

            <motion.div
              className="heartbeat-marker"
              style={{ left: `${position}%` }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Heart size={23} fill="currentColor" />
            </motion.div>
          </div>

          <div className="heartbeat-result">
            <AnimatePresence mode="wait">
              <motion.span
                key={lastResult || "waiting"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {lastResult || "WAIT FOR THE PERFECT MOMENT"}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="heartbeat-action">
            {gameState === "ready" && (
              <div className="heartbeat-intro">
                <div className="heartbeat-icon">
                  <Heart size={36} fill="currentColor" />
                </div>
                <h2>Ready to feel the rhythm?</h2>
                <p>15 beats. One perfect rhythm. Let's go!</p>
                <button onClick={startGame}>
                  <Play size={17} fill="currentColor" />
                  Start Rhythm
                </button>
              </div>
            )}

            {gameState === "playing" && (
              <button className="heartbeat-tap" onClick={handleTap}>
                <Heart size={24} fill="currentColor" />
                TAP NOW
              </button>
            )}

            {gameState === "finished" && (
              <motion.div
                className="heartbeat-finish"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Trophy size={38} />
                <h2>Beautiful rhythm!</h2>
                <p>You scored {score} points.</p>

                <div className="heartbeat-result-stats">
                  <div>
                    <strong>{perfectCount}</strong>
                    <span>PERFECT</span>
                  </div>
                  <div>
                    <strong>{goodCount}</strong>
                    <span>GOOD</span>
                  </div>
                  <div>
                    <strong>{missCount}</strong>
                    <span>MISS</span>
                  </div>
                </div>

                <button onClick={startGame}>
                  <RotateCcw size={16} />
                  Play Again
                </button>
              </motion.div>
            )}
          </div>

          <div className="heartbeat-legend">
            <span>PERFECT +100</span>
            <span>GOOD +50</span>
            <span>MISS +0</span>
          </div>
        </section>

        <section className="heartbeat-tips">
          <Zap size={19} />
          <div>
            <strong>Little tip</strong>
            <p>
              Don't tap too early! The closer the pulse is to the center,
              the more points you earn.
            </p>
          </div>
        </section>

        <footer className="heartbeat-footer">
          MADE WITH LOVE, ONE BEAT AT A TIME
        </footer>
      </div>
    </main>
  );
};

export default HeartbeatRhythm;