import React from "react";
import "./GalaxyBackground.css";

export default function GalaxyBackground() {
  return (
    <div className="galaxy-background">
      <div className="galaxy-nebula nebula-one" />
      <div className="galaxy-nebula nebula-two" />
      <div className="galaxy-nebula nebula-three" />

      <div className="galaxy-moon">
        <div className="moon-shadow" />
      </div>

      <div className="galaxy-orbit orbit-one" />
      <div className="galaxy-orbit orbit-two" />

      <div className="galaxy-glow glow-one" />
      <div className="galaxy-glow glow-two" />

      <div className="galaxy-horizon" />
    </div>
  );
}