import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  Brain,
  Timer,
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

import { puzzles } from "../data/puzzles";

import BackButton from "../components/BackButton";

import "./BrainPlayground.css";

const ROUND_SIZE = 5;

function createRound(difficulty) {
  const filtered = puzzles.filter(
    (puzzle) =>
      difficulty === "ALL" ||
      puzzle.difficulty === difficulty
  );

  const pool = [...filtered];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, ROUND_SIZE);
}

export default function BrainPlayground() {
  const [difficulty, setDifficulty] = useState("ALL");
  const [round, setRound] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const currentPuzzle = round[questionIndex];

  useEffect(() => {
    if (!gameStarted || gameFinished || selectedAnswer !== null) {
      return;
    }

    if (timeLeft <= 0) {
      setSelectedAnswer("TIME_UP");
      setStreak(0);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    gameStarted,
    gameFinished,
    selectedAnswer,
    timeLeft,
  ]);

  const startGame = (selectedDifficulty = difficulty) => {
    const newRound = createRound(selectedDifficulty);

    setDifficulty(selectedDifficulty);
    setRound(newRound);

    setQuestionIndex(0);
    setSelectedAnswer(null);

    setScore(0);
    setStreak(0);

    setTimeLeft(newRound[0]?.time || 20);

    setGameFinished(false);
    setGameStarted(true);
  };

  const selectAnswer = (answer) => {
    if (selectedAnswer !== null || !currentPuzzle) return;

    setSelectedAnswer(answer);

    if (answer === currentPuzzle.answer) {
      setScore((previous) => previous + 100 + timeLeft * 2);
      setStreak((previous) => previous + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= round.length) {
      setGameFinished(true);
      return;
    }

    const nextIndex = questionIndex + 1;

    setQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setTimeLeft(round[nextIndex].time);
  };

  const restartGame = () => {
    startGame(difficulty);
  };

  const correct =
    selectedAnswer === currentPuzzle?.answer;

  return (
    <div className="brain-page page-container">

      <BackButton fallback="/" showHome />

      <header className="brain-header">
        <div className="brain-eyebrow">
          <Brain size={16} />
          THE MYSTERY LABORATORY
        </div>

        <h1>
          Think beyond
          <br />
          <span>the obvious.</span>
        </h1>

        <p>
          Logic, patterns and mysterious little riddles.
          Your mission is to solve five challenges.
        </p>
      </header>

      {!gameStarted && (
        <motion.section
          className="brain-start-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="brain-start-icon">
            <Target size={34} />
          </div>

          <span>MISSION CONTROL</span>

          <h2>Ready to test your brain?</h2>

          <p>
            Choose your difficulty and start a five-question
            mystery challenge.
          </p>

          <div className="brain-difficulty-options">
            {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => (
              <button
                key={level}
                className={
                  difficulty === level
                    ? "difficulty-option active"
                    : "difficulty-option"
                }
                onClick={() => setDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            className="brain-start-button"
            onClick={() => startGame(difficulty)}
          >
            <Zap size={18} />
            Start Mystery Mission
            <ArrowRight size={18} />
          </button>
        </motion.section>
      )}

      {gameStarted && !gameFinished && currentPuzzle && (
        <motion.section
          className="brain-game-panel"
          key={currentPuzzle.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="brain-game-stats">
            <div>
              <span>QUESTION</span>
              <strong>
                {questionIndex + 1}/{round.length}
              </strong>
            </div>

            <div>
              <span>SCORE</span>
              <strong>{score}</strong>
            </div>

            <div>
              <span>STREAK</span>
              <strong>{streak} 🔥</strong>
            </div>
          </div>

          <div className="brain-progress">
            <div
              style={{
                width: `${
                  ((questionIndex + 1) / round.length) * 100
                }%`,
              }}
            />
          </div>

          <div className="brain-question-heading">
            <span>{currentPuzzle.category}</span>
            <span className="brain-difficulty-badge">
              {currentPuzzle.difficulty}
            </span>
          </div>

          <div className="brain-timer">
            <Timer size={19} />

            <span>
              {timeLeft}s remaining
            </span>

            <div className="brain-timer-track">
              <div
                style={{
                  width: `${
                    (timeLeft / currentPuzzle.time) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="brain-question-card">
            <h2>{currentPuzzle.question}</h2>

            <div className="brain-visual">
              {currentPuzzle.visual}
            </div>
          </div>

          <div className="brain-answer-grid">
            {currentPuzzle.options.map((option, index) => {
              const isCorrect = option === currentPuzzle.answer;
              const isSelected = option === selectedAnswer;

              let className = "brain-answer-option";

              if (selectedAnswer !== null && isCorrect) {
                className += " correct";
              } else if (isSelected && !correct) {
                className += " incorrect";
              }

              return (
                <button
                  key={option}
                  className={className}
                  onClick={() => selectAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  <span>
                    {String.fromCharCode(65 + index)}
                  </span>

                  {option}

                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 size={18} />
                  )}

                  {isSelected && !correct && (
                    <XCircle size={18} />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.div
                className={`brain-feedback ${
                  correct ? "feedback-correct" : "feedback-wrong"
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {correct ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <XCircle size={22} />
                )}

                <div>
                  <strong>
                    {correct
                      ? "Brilliant! That's correct."
                      : selectedAnswer === "TIME_UP"
                      ? "Time's up!"
                      : "Not quite! Keep learning."}
                  </strong>

                  <p>{currentPuzzle.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedAnswer !== null && (
            <button
              className="brain-next-button"
              onClick={nextQuestion}
            >
              {questionIndex + 1 === round.length
                ? "View Final Results"
                : "Next Mystery"}

              <ArrowRight size={18} />
            </button>
          )}
        </motion.section>
      )}

      {gameFinished && (
        <motion.section
          className="brain-result-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="brain-result-icon">
            <Trophy size={40} />
          </div>

          <span>MISSION COMPLETED</span>

          <h2>
            {score >= 500
              ? "Incredible, little genius!"
              : score >= 250
              ? "Well done, mystery solver!"
              : "Every puzzle teaches something!"}
          </h2>

          <div className="brain-final-score">
            {score}
            <span>POINTS</span>
          </div>

          <p>
            You completed all {round.length} mystery challenges.
            Ready for another round?
          </p>

          <button
            className="brain-start-button"
            onClick={restartGame}
          >
            <RefreshCw size={18} />
            Play Again
          </button>

          <button
            className="brain-secondary-button"
            onClick={() => {
              setGameStarted(false);
              setGameFinished(false);
            }}
          >
            Change Difficulty
          </button>
        </motion.section>
      )}

      <div className="brain-footer-note">
        <Sparkles size={16} />
        Every great mystery starts with one curious mind.
      </div>
    </div>
  );
}