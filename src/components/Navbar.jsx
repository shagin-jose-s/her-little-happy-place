import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Smile", path: "/smile" },
    { label: "Games", path: "/play" },
    { label: "Letters", path: "/letters" },
    { label: "Brain", path: "/brain" },
    { label: "Mood", path: "/mood" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="navbar-logo">
            <Sparkles size={24} />
          </div>

          <div className="navbar-brand-text">
            <h2>little happy place</h2>
            <span>A LITTLE JOY, EVERY DAY</span>
          </div>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
          {links.map((link) => {
            const active =
              location.pathname === link.path ||
              (link.path !== "/" &&
                location.pathname.startsWith(link.path + "/"));

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={active ? "nav-link active" : "nav-link"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="navbar-right">
          <div className="navbar-heart">
            <Heart size={18} fill="currentColor" />
          </div>

          <button
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}