import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";

import "./Game.css";

const questions = [

  {
    emoji: "🐝 + 🍯",
    answers: [
      "Honey Bee",
      "Sweet as Honey",
      "Bee Happy"
    ],
    correct: 2
  },

  {
    emoji: "🌧️ + 🐱 + 🐶",
    answers: [
      "Rainy Day",
      "Raining Cats and Dogs",
      "Pet Shower"
    ],
    correct: 1
  },

  {
    emoji: "⭐ + 🐟",
    answers: [
      "Starfish",
      "Night Swim",
      "Shiny Fish"
    ],
    correct: 0
  },

  {
    emoji: "🧊 + 🍦",
    answers: [
      "Cold Dessert",
      "Ice Cream",
      "Frozen Lake"
    ],
    correct: 1
  }

];

export default function EmojiQuiz() {

  const [index, setIndex] = useState(0);

  const [answer, setAnswer] = useState(null);

  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);

  const question = questions[index];

  const chooseAnswer = (number) => {

    if (answer !== null) return;

    setAnswer(number);

    if (number === question.correct) {
      setScore((previous) => previous + 1);
    }

  };

  const nextQuestion = () => {

    if (index === questions.length - 1) {

      setFinished(true);

    } else {

      setIndex((previous) => previous + 1);

      setAnswer(null);

    }

  };

  const restartQuiz = () => {

    setIndex(0);

    setAnswer(null);

    setScore(0);

    setFinished(false);

  };

  if (finished) {

    return (

      <div className="page-section game-page quiz-finished">

        <div className="quiz-trophy">
          🏆
        </div>

        <h1>Quiz Completed!</h1>

        <p className="page-intro">
          You scored {score} out of {questions.length}.
        </p>

        <h2>
          {score === 4
            ? "Perfect! You're amazing! 🌟"
            : score >= 2
            ? "Lovely effort! 💗"
            : "Keep playing and learning! 🌷"}
        </h2>

        <button
          className="primary-button restart-quiz"
          onClick={restartQuiz}
        >
          <RefreshCw size={16} />
          Play Again
        </button>

      </div>

    );

  }

  return (

    <div className="page-section game-page">

      <a className="back-link" href="/play">
        ← All games
      </a>

      <h1>Emoji Quiz 🍉</h1>

      <p className="page-intro">
        Can you decode these emoji clues?
      </p>

      <div className="quiz-progress">

        <span>
          Question {index + 1}/{questions.length}
        </span>

        <span>
          ⭐ {score} points
        </span>

      </div>

      <div className="emoji-question">
        {question.emoji}
      </div>

      <div className="answer-list">

        {question.answers.map((option, number) => (

          <button
            key={option}
            className={`answer-option ${
              answer !== null && number === question.correct
                ? "correct"
                : answer === number
                ? "wrong"
                : ""
            }`}
            onClick={() => chooseAnswer(number)}
          >

            {option}

          </button>

        ))}

      </div>

      {answer !== null && (

        <button
          className="primary-button next-question"
          onClick={nextQuestion}
        >

          {index === questions.length - 1
            ? "See Results"
            : "Next Question →"}

        </button>

      )}

    </div>

  );

}