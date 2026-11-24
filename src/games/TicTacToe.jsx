import { useState } from "react";
import { RotateCcw } from "lucide-react";

import "./Game.css";

const winningCombinations = [

  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]

];

export default function TicTacToe() {

  const [board, setBoard] = useState(
    Array(9).fill("")
  );

  const [turn, setTurn] = useState("🌷");

  const winner = winningCombinations.find((combination) =>
    combination.every(
      (index) =>
        board[index] &&
        board[index] === board[combination[0]]
    )
  );

  const draw = !winner && board.every(Boolean);

  const play = (index) => {

    if (board[index] || winner || draw) return;

    const updatedBoard = [...board];

    updatedBoard[index] = turn;

    setBoard(updatedBoard);

    setTurn(
      turn === "🌷" ? "🌙" : "🌷"
    );

  };

  const resetGame = () => {

    setBoard(Array(9).fill(""));

    setTurn("🌷");

  };

  return (

    <div className="page-section game-page">

      <a className="back-link" href="/play">
        ← All games
      </a>

      <h1>Tic Tac Toe 🌷</h1>

      <p className="page-intro">
        A little friendly competition!
      </p>

      <div className="tic-status">

        {winner
          ? `${board[winner[0]]} Wins! 🎉`
          : draw
          ? "It's a draw! 💗"
          : `${turn}'s Turn`}
          
      </div>

      <div className="tic-grid">

        {board.map((value, index) => (

          <button
            key={index}
            className="tic-cell"
            onClick={() => play(index)}
          >

            {value}

          </button>

        ))}

      </div>

      {(winner || draw) && (

        <div className="game-success">

          <h2>
            {winner
              ? "Wonderful game! 🎉"
              : "Good game! 🌸"}
          </h2>

          <p>
            Play another round?
          </p>

        </div>

      )}

      <button
        className="pill-button"
        onClick={resetGame}
      >

        <RotateCcw size={15} />

        New Round

      </button>

    </div>

  );

}