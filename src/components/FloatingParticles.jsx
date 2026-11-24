import React, { useMemo } from "react";
import "./FloatingParticles.css";

const symbols = ["✦", "✧", "·", "✦", "♡", "✧"];

export default function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, index) => ({
        id: index,
        symbol: symbols[index % symbols.length],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${5 + Math.random() * 8}s`,
        size: `${8 + Math.random() * 14}px`,
      })),
    []
  );

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="floating-particle"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            fontSize: particle.size,
          }}
        >
          {particle.symbol}
        </span>
      ))}
    </div>
  );
}