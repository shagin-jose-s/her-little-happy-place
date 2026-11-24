import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Star,
  Clock3,
  Footprints,
  Trophy,
  RotateCcw,
  Sparkles,
  Flag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./DreamMaze.css";

const SIZE = 9;

const createMaze = () => {
  const maze = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      walls: [true, true, true, true],
      visited: false,
    }))
  );

  const directions = [
    [-1, 0, 0, 2],
    [0, 1, 1, 3],
    [1, 0, 2, 0],
    [0, -1, 3, 1],
  ];

  const stack = [[0, 0]];
  maze[0][0].visited = true;

  while (stack.length) {
    const [row, col] = stack[stack.length - 1];

    const neighbours = directions
      .map(([dr, dc, wall, opposite]) => ({
        row: row + dr,
        col: col + dc,
        wall,
        opposite,
      }))
      .filter(
        (next) =>
          next.row >= 0 &&
          next.row < SIZE &&
          next.col >= 0 &&
          next.col < SIZE &&
          !maze[next.row][next.col].visited
      );

    if (!neighbours.length) {
      stack.pop();
      continue;
    }

    const next =
      neighbours[Math.floor(Math.random() * neighbours.length)];

    maze[row][col].walls[next.wall] = false;
    maze[next.row][next.col].walls[next.opposite] = false;
    maze[next.row][next.col].visited = true;

    stack.push([next.row, next.col]);
  }

  return maze;
};

const createStars = () => {
  const positions = new Set(["0-0", `${SIZE - 1}-${SIZE - 1}`]);
  const stars = [];

  while (stars.length < 3) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    const key = `${row}-${col}`;

    if (!positions.has(key)) {
      positions.add(key);
      stars.push({ row, col, id: key });
    }
  }

  return stars;
};

const DreamMaze = () => {
  const navigate = useNavigate();

  const [maze, setMaze] = useState(() => createMaze());
  const [player, setPlayer] = useState({ row: 0, col: 0 });
  const [stars, setStars] = useState(() => createStars());
  const [collected, setCollected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameState, setGameState] = useState("ready");
  const [bestTime, setBestTime] = useState(
    () => Number(localStorage.getItem("dream-maze-best") || 0)
  );

  const playerRef = useRef({ row: 0, col: 0 });
  const mazeRef = useRef(maze);
  const starsRef = useRef(stars);
  const collectedRef = useRef([]);
  const gameStateRef = useRef("ready");

  const startGame = () => {
    const nextMaze = createMaze();
    const nextStars = createStars();

    mazeRef.current = nextMaze;
    starsRef.current = nextStars;
    playerRef.current = { row: 0, col: 0 };
    collectedRef.current = [];
    gameStateRef.current = "playing";

    setMaze(nextMaze);
    setStars(nextStars);
    setPlayer({ row: 0, col: 0 });
    setCollected([]);
    setMoves(0);
    setSeconds(0);
    setGameState("playing");
  };

  const move = useCallback((direction) => {
    if (gameStateRef.current !== "playing") return;

    const [dr, dc, wallIndex] = direction;

    const current = playerRef.current;
    const currentCell = mazeRef.current[current.row][current.col];

    if (currentCell.walls[wallIndex]) return;

    const nextRow = current.row + dr;
    const nextCol = current.col + dc;

    if (
      nextRow < 0 ||
      nextRow >= SIZE ||
      nextCol < 0 ||
      nextCol >= SIZE
    ) {
      return;
    }

    const nextPosition = { row: nextRow, col: nextCol };

    playerRef.current = nextPosition;
    setPlayer(nextPosition);
    setMoves((previous) => previous + 1);

    const star = starsRef.current.find(
      (item) =>
        item.row === nextRow &&
        item.col === nextCol &&
        !collectedRef.current.includes(item.id)
    );

    if (star) {
      const nextCollected = [...collectedRef.current, star.id];
      collectedRef.current = nextCollected;
      setCollected(nextCollected);
    }

    if (
      nextRow === SIZE - 1 &&
      nextCol === SIZE - 1 &&
      collectedRef.current.length === 3
    ) {
      gameStateRef.current = "won";
      setGameState("won");
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "won") return;

    setBestTime((previous) => {
      const next =
        previous === 0 ? seconds : Math.min(previous, seconds);

      localStorage.setItem("dream-maze-best", String(next));
      return next;
    });
  }, [gameState, seconds]);

  useEffect(() => {
    const directions = {
      ArrowUp: [-1, 0, 0],
      w: [-1, 0, 0],
      ArrowRight: [0, 1, 1],
      d: [0, 1, 1],
      ArrowDown: [1, 0, 2],
      s: [1, 0, 2],
      ArrowLeft: [0, -1, 3],
      a: [0, -1, 3],
    };

    const handleKey = (event) => {
      const direction = directions[event.key];

      if (direction) {
        event.preventDefault();
        move(direction);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  const getCellContent = (row, col) => {
    const isPlayer = player.row === row && player.col === col;
    const isExit = row === SIZE - 1 && col === SIZE - 1;

    const star = stars.find(
      (item) =>
        item.row === row &&
        item.col === col &&
        !collected.includes(item.id)
    );

    if (isPlayer) return <span className="maze-player">💜</span>;
    if (star) return <Star size={17} fill="currentColor" />;
    if (isExit) return <Flag size={17} />;

    return null;
  };

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const secondsLeft = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secondsLeft
    ).padStart(2, "0")}`;
  };

  const controlDirections = [
    { icon: ArrowUp, value: [-1, 0, 0], className: "maze-up" },
    { icon: ArrowLeft, value: [0, -1, 3], className: "maze-left" },
    { icon: ArrowDown, value: [1, 0, 2], className: "maze-down" },
    { icon: ArrowRight, value: [0, 1, 1], className: "maze-right" },
  ];

  return (
    <main className="dream-maze-page">
      <div className="dream-maze-bg">
        <div className="maze-glow maze-glow-one" />
        <div className="maze-glow maze-glow-two" />
      </div>

      <div className="dream-maze-container">
        <header className="dream-maze-topbar">
          <button
            onClick={() => navigate("/play")}
            className="maze-back-btn"
          >
            <ArrowLeft size={17} />
            Arcade
          </button>

          <span className="maze-brand">
            <Sparkles size={17} />
            DREAM MAZE
          </span>
        </header>

        <section className="maze-hero">
          <span>THE MYSTERIOUS LITTLE WORLD</span>
          <h1>
            Find your <strong>way home.</strong>
          </h1>
          <p>
            Explore the maze, collect all three stars,
            <br />
            and find the magical exit.
          </p>
        </section>

        <div className="maze-dashboard">
          <div>
            <Clock3 size={17} />
            <span>TIME</span>
            <strong>{formatTime(seconds)}</strong>
          </div>

          <div>
            <Footprints size={17} />
            <span>MOVES</span>
            <strong>{moves}</strong>
          </div>

          <div>
            <Star size={17} />
            <span>STARS</span>
            <strong>{collected.length}/3</strong>
          </div>

          <div>
            <Trophy size={17} />
            <span>BEST</span>
            <strong>{bestTime ? formatTime(bestTime) : "--:--"}</strong>
          </div>
        </div>

        <section className="maze-game-shell">
          <div className="maze-game-heading">
            <div>
              <span>YOUR DESTINATION</span>
              <strong>THE DREAM EXIT</strong>
            </div>

            <div className="maze-star-counter">
              {Array.from({ length: 3 }).map((_, index) => (
                <Star
                  key={index}
                  size={19}
                  fill={index < collected.length ? "currentColor" : "none"}
                  className={
                    index < collected.length
                      ? "maze-star-collected"
                      : "maze-star-empty"
                  }
                />
              ))}
            </div>
          </div>

          <div className="maze-board">
            {maze.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="maze-cell"
                  style={{
                    borderTop: cell.walls[0]
                      ? "2px solid #72528d"
                      : "2px solid transparent",
                    borderRight: cell.walls[1]
                      ? "2px solid #72528d"
                      : "2px solid transparent",
                    borderBottom: cell.walls[2]
                      ? "2px solid #72528d"
                      : "2px solid transparent",
                    borderLeft: cell.walls[3]
                      ? "2px solid #72528d"
                      : "2px solid transparent",
                  }}
                >
                  {getCellContent(rowIndex, colIndex)}
                </div>
              ))
            )}
          </div>

          <div className="maze-controls">
            <p>YOUR LITTLE CONTROLS</p>

            <div className="maze-dpad">
              {controlDirections.map(({ icon: Icon, value, className }) => (
                <button
                  key={className}
                  className={className}
                  onClick={() => move(value)}
                  aria-label={className}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>

            <span>Use arrow keys, WASD or the buttons above.</span>
          </div>

          <div className="maze-game-footer">
            <button onClick={startGame} className="maze-restart-btn">
              <RotateCcw size={16} />
              New Maze
            </button>

            <span>COLLECT 3 STARS BEFORE THE EXIT</span>
          </div>

          <AnimatePresence>
            {(gameState === "ready" || gameState === "won") && (
              <motion.div
                className="maze-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="maze-overlay-content">
                  <div className="maze-overlay-icon">
                    {gameState === "won" ? (
                      <Trophy size={35} />
                    ) : (
                      <Sparkles size={35} />
                    )}
                  </div>

                  <span>
                    {gameState === "won"
                      ? "MISSION COMPLETED"
                      : "A NEW WORLD AWAITS"}
                  </span>

                  <h2>
                    {gameState === "won"
                      ? "You found your way!"
                      : "Ready to explore?"}
                  </h2>

                  <p>
                    {gameState === "won"
                      ? `You collected all stars in ${formatTime(seconds)} with ${moves} moves.`
                      : "Collect all three stars and reach the magical exit."}
                  </p>

                  <button onClick={startGame}>
                    <PlayIcon />
                    {gameState === "won" ? "Explore Again" : "Enter Maze"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="maze-footer">
          MADE FOR LITTLE ADVENTURES
        </footer>
      </div>
    </main>
  );
};

const PlayIcon = () => <Sparkles size={17} />;

export default DreamMaze;