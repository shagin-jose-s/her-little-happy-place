import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";
import "./BackButton.css";

const BackButton = ({ fallback = "/", showHome = true }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <div className="smart-back-controls">
      <button
        className="smart-back-btn"
        onClick={handleBack}
        aria-label="Go back"
      >
        <ArrowLeft size={18} />
        <span>Go Back</span>
      </button>

      {showHome && (
        <button
          className="smart-home-btn"
          onClick={() => navigate("/")}
          aria-label="Go home"
        >
          <House size={17} />
          <span>Home</span>
        </button>
      )}
    </div>
  );
};

export default BackButton;