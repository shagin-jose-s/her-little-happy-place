import React from "react";
import { Link } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import "./ActivityCard.css";

export default function ActivityCard({
  title,
  description,
  icon: Icon,
  emoji,
  path,
  number,
  tag,
  theme = "pink",
}) {
  return (
    <motion.div
      className={`activity-card activity-theme-${theme}`}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
    >
      <Link to={path} className="activity-card-link">

        <div className="activity-card-top">

          <span className="activity-number">
            {number}
          </span>

          <span className="activity-arrow">
            <ArrowUpRight size={20} />
          </span>

        </div>

        <div className="activity-card-icon">
          {Icon ? <Icon size={32} /> : emoji}
        </div>

        <div className="activity-card-content">

          <span className="activity-tag">
            {tag || "EXPLORE"}
          </span>

          <h3>{title}</h3>

          <p>{description}</p>

        </div>

        <div className="activity-card-decoration">
          ✦
        </div>

        <div className="activity-card-glow" />

      </Link>
    </motion.div>
  );
}