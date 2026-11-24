import { Sparkles, Heart, Flower2, ArrowRight } from "lucide-react";

import "./WelcomeScreen.css";

export default function WelcomeScreen({ onEnter }) {
  return (
    <main className="welcome-screen">

      <div className="welcome-orb orb-one" />
      <div className="welcome-orb orb-two" />

      <span className="deco deco-one">✿</span>
      <span className="deco deco-two">✧</span>
      <span className="deco deco-three">♡</span>

      <section className="welcome-card">

        <div className="welcome-emblem">
          <Flower2 size={28} />
        </div>

        <p className="eyebrow">
          <Sparkles size={13} />
          YOUR LITTLE CORNER OF JOY
        </p>

        <h1>
          Hey, lovely<span>!</span>
        </h1>

        <p className="welcome-copy">
          A tiny corner of the internet filled with little games,
          happy surprises and reasons to smile.
        </p>

        <button
          className="primary-button welcome-button"
          onClick={onEnter}
        >
          Step into my happy place

          <ArrowRight size={17} />
        </button>

        <p className="welcome-foot">
          <Heart size={12} fill="currentColor" />
          Made for smiles, at your own pace
        </p>

      </section>

    </main>
  );
}