import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// GLOBAL STYLES
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/final-polish.css";

// SHARED COMPONENTS
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import LoadingScreen from "./components/LoadingScreen";
import GalaxyBackground from "./components/GalaxyBackground";
import FloatingParticles from "./components/FloatingParticles";

// PAGES
import Home from "./pages/Home";
import SmileStudio from "./pages/SmileStudio";
import PlayGarden from "./pages/PlayGarden";
import LittleLetters from "./pages/LittleLetters";
import BrainPlayground from "./pages/BrainPlayground";
import MoodGarden from "./pages/MoodGarden";

// GAMES
import CatchTheStars from "./games/CatchTheStars";
import MemoryMatch from "./games/MemoryMatch";
import HeartbeatRhythm from "./games/HeartbeatRhythm";
import DreamMaze from "./games/DreamMaze";

function AppContent() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  // Initial loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      {/* Animated background */}
      <GalaxyBackground />
      <FloatingParticles />

      {/* Navigation */}
      <Navbar />

      {/* Page content */}
      <main key={location.pathname} className="page-transition">
        <Routes>
          {/* MAIN PAGES */}
          <Route path="/" element={<Home />} />

          <Route path="/smile" element={<SmileStudio />} />

          <Route path="/play" element={<PlayGarden />} />

          <Route path="/letters" element={<LittleLetters />} />

          <Route path="/brain" element={<BrainPlayground />} />

          <Route path="/mood" element={<MoodGarden />} />

          {/* GAMES */}
          <Route
            path="/play/catch"
            element={<CatchTheStars />}
          />

          <Route
            path="/play/memory"
            element={<MemoryMatch />}
          />

          <Route
            path="/play/heartbeat"
            element={<HeartbeatRhythm />}
          />

          <Route
            path="/play/maze"
            element={<DreamMaze />}
          />

          {/* FALLBACK */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);