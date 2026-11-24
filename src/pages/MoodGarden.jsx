import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Moon,
  Sun,
  CloudRain,
  Zap,
  Heart,
  Sparkles,
  Music,
  Coffee,
  Gamepad2,
  BookOpen,
  Flower2,
  Smile,
  Send,
  RotateCcw,
} from "lucide-react";

import BackButton from "../components/BackButton";
import "./MoodGarden.css";

const moods = [
  {
    id: "happy",
    name: "Feeling Happy",
    emoji: "🌞",
    subtitle: "Let's make this moment even brighter.",
    color: "#ffbd59",
    description:
      "A happy day deserves a little celebration. Keep that beautiful energy going.",
    activities: [
      {
        icon: Gamepad2,
        title: "Play something fun",
        description: "Try a new game and beat your best score.",
      },
      {
        icon: Music,
        title: "Dance break",
        description: "Play your favourite song and enjoy the moment.",
      },
      {
        icon: Heart,
        title: "Share some happiness",
        description: "Send someone a little appreciation message.",
      },
    ],
  },
  {
    id: "calm",
    name: "Feeling Calm",
    emoji: "🌙",
    subtitle: "Let's keep this peaceful little moment.",
    color: "#9c8cff",
    description:
      "Slow moments are beautiful too. Enjoy a little space for yourself.",
    activities: [
      {
        icon: Music,
        title: "Soft music",
        description: "Listen to something peaceful.",
      },
      {
        icon: Coffee,
        title: "Take a little break",
        description: "Enjoy your favourite drink without rushing.",
      },
      {
        icon: BookOpen,
        title: "Read something lovely",
        description: "Find a little story or poem.",
      },
    ],
  },
  {
    id: "sad",
    name: "Feeling Low",
    emoji: "🌧️",
    subtitle: "It's okay to have a slower day.",
    color: "#75b9e7",
    description:
      "You don't have to force a smile. Take your time and be kind to yourself.",
    activities: [
      {
        icon: Heart,
        title: "Open a little letter",
        description: "Read a gentle reminder.",
      },
      {
        icon: Music,
        title: "Listen to comforting music",
        description: "Choose something that feels familiar.",
      },
      {
        icon: Coffee,
        title: "A little comfort break",
        description: "Take a moment to relax.",
      },
    ],
  },
  {
    id: "bored",
    name: "Feeling Bored",
    emoji: "🪐",
    subtitle: "Let's find something interesting.",
    color: "#d58cff",
    description:
      "Your next little adventure could be just one click away.",
    activities: [
      {
        icon: Gamepad2,
        title: "Enter the arcade",
        description: "Try a game you haven't played before.",
      },
      {
        icon: Sparkles,
        title: "Take a challenge",
        description: "Try a random happiness challenge.",
      },
      {
        icon: BookOpen,
        title: "Solve a mystery",
        description: "Test your brain with a puzzle.",
      },
    ],
  },
  {
    id: "tired",
    name: "Feeling Tired",
    emoji: "☁️",
    subtitle: "You deserve a little pause.",
    color: "#a7a0bd",
    description:
      "You don't have to be productive every moment. Rest is important too.",
    activities: [
      {
        icon: Moon,
        title: "Quiet time",
        description: "Take a break from screens and noise.",
      },
      {
        icon: Music,
        title: "Relaxing sounds",
        description: "Listen to something gentle.",
      },
      {
        icon: Flower2,
        title: "Slow down",
        description: "Give yourself permission to pause.",
      },
    ],
  },
  {
    id: "excited",
    name: "Feeling Excited",
    emoji: "⚡",
    subtitle: "That energy deserves an adventure!",
    color: "#ff70b7",
    description:
      "You've got energy to spare. Let's turn it into something fun.",
    activities: [
      {
        icon: Zap,
        title: "Take a quick challenge",
        description: "Try to beat a little personal record.",
      },
      {
        icon: Gamepad2,
        title: "Play a new game",
        description: "Explore the dream arcade.",
      },
      {
        icon: Smile,
        title: "Create a happy moment",
        description: "Do something spontaneous and fun.",
      },
    ],
  },
];

export default function MoodGarden() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journal, setJournal] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);

    setSavedEntries((previous) => [
      {
        mood: mood.name,
        emoji: mood.emoji,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...previous,
    ]);
  };

  const saveJournal = () => {
    if (!journal.trim()) return;

    setSavedEntries((previous) => [
      {
        mood: "Personal Note",
        emoji: "📝",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        note: journal.trim(),
      },
      ...previous,
    ]);

    setJournal("");
  };

  const resetMood = () => {
    setSelectedMood(null);
  };

  return (
    <div
      className={`mood-page page-container ${
        selectedMood ? "mood-selected" : ""
      }`}
      style={{
        "--mood-color": selectedMood?.color || "#ff70b7",
      }}
    >
      <BackButton fallback="/" showHome />

      <header className="mood-header">
        <div className="mood-eyebrow">
          <Moon size={16} />
          YOUR PERSONAL MOOD GALAXY
        </div>

        <h1>
          How's your
          <br />
          <span>universe today?</span>
        </h1>

        <p>
          Every feeling deserves its own little space.
          Choose what feels closest to you right now.
        </p>
      </header>

      {/* MOOD SELECTOR */}

      <section className="mood-selector-section">
        <div className="mood-selector-heading">
          <span>CHOOSE YOUR CURRENT MOOD</span>
          <Sparkles size={20} />
        </div>

        <div className="mood-selector-grid">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              className={`mood-orb ${
                selectedMood?.id === mood.id ? "selected" : ""
              }`}
              style={{ "--orb-color": mood.color }}
              onClick={() => handleMoodSelect(mood)}
              whileHover={{ y: -7, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="mood-orb-glow" />

              <span className="mood-orb-emoji">
                {mood.emoji}
              </span>

              <strong>{mood.name}</strong>

              <span className="mood-orb-indicator">
                {selectedMood?.id === mood.id
                  ? "SELECTED"
                  : "TAP TO SELECT"}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* SELECTED MOOD */}

      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.section
            key={selectedMood.id}
            className="mood-result-section"
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mood-result-card">
              <div className="mood-result-orbit">
                <div className="mood-result-emoji">
                  {selectedMood.emoji}
                </div>
              </div>

              <span className="mood-result-label">
                YOUR CURRENT DIMENSION
              </span>

              <h2>{selectedMood.name}</h2>

              <h3>{selectedMood.subtitle}</h3>

              <p>{selectedMood.description}</p>

              <button
                className="mood-reset-button"
                onClick={resetMood}
              >
                <RotateCcw size={16} />
                Choose another mood
              </button>
            </div>

            <div className="mood-recommendations">
              <span>YOUR LITTLE RECOMMENDATIONS</span>

              <h2>Things you could try.</h2>

              <div className="mood-activity-list">
                {selectedMood.activities.map((activity, index) => {
                  const Icon = activity.icon;

                  return (
                    <motion.div
                      key={activity.title}
                      className="mood-activity"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12 }}
                    >
                      <div className="mood-activity-icon">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h3>{activity.title}</h3>
                        <p>{activity.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* PERSONAL JOURNAL */}

      <section className="mood-journal">
        <div className="journal-heading">
          <div>
            <span>YOUR PRIVATE SPACE</span>
            <h2>A little thought journal.</h2>
          </div>

          <Heart size={26} />
        </div>

        <p>
          Want to write something down? This little space is
          yours.
        </p>

        <textarea
          value={journal}
          onChange={(event) => setJournal(event.target.value)}
          placeholder="Write whatever is on your mind..."
          maxLength={500}
        />

        <div className="journal-footer">
          <span>{journal.length}/500</span>

          <button
            className="mood-save-button"
            onClick={saveJournal}
            disabled={!journal.trim()}
          >
            <Send size={16} />
            Save my thought
          </button>
        </div>
      </section>

      {/* HISTORY */}

      {savedEntries.length > 0 && (
        <section className="mood-history">
          <div className="journal-heading">
            <div>
              <span>THIS SESSION</span>
              <h2>Your little moments.</h2>
            </div>

            <Sun size={25} />
          </div>

          {savedEntries.map((entry, index) => (
            <div className="mood-history-item" key={index}>
              <span>{entry.emoji}</span>

              <div>
                <strong>{entry.mood}</strong>

                {entry.note && <p>{entry.note}</p>}
              </div>

              <time>{entry.time}</time>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}