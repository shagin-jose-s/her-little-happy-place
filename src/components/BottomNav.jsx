import React from "react";
import { NavLink } from "react-router-dom";

import {
  Home,
  Smile,
  Gamepad2,
  Mail,
  Brain,
  Flower2,
} from "lucide-react";

import "./BottomNav.css";

const items = [
  { label: "Home", path: "/", icon: Home },
  { label: "Smile", path: "/smile", icon: Smile },
  { label: "Play", path: "/play", icon: Gamepad2 },
  { label: "Letters", path: "/letters", icon: Mail },
  { label: "Brain", path: "/brain", icon: Brain },
  { label: "Mood", path: "/mood", icon: Flower2 },
];

export default function BottomNav() {
  return (
    <nav className="bottom-navigation">
      {items.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="bottom-nav-icon">
            <Icon size={20} />
          </span>

          <span className="bottom-nav-label">
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}