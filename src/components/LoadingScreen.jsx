import React from "react";
import { Sparkles, Heart } from "lucide-react";

import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-stars">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
        <span>♡</span>
      </div>

      <div className="loading-content">
        <div className="loading-orbit">
          <div className="loading-core">
            <Heart size={35} fill="currentColor" />
          </div>

          <div className="loading-orbit-dot">
            <Sparkles size={18} />
          </div>
        </div>

        <h1>little happy place</h1>

        <p>Preparing a little magic for you...</p>

        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>

        <span className="loading-caption">
          MADE WITH A LITTLE EXTRA LOVE
        </span>
      </div>
    </div>
  );
}