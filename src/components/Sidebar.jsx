import { useState } from "react";

import "../styles/sidebar.css";

import MiniPlayer from "./MiniPlayer";

export default function Sidebar({
  activeView,
  setActiveView,
  currentSong,
  isPlaying,
  togglePlay,
  setShowPlayer,
  currentTime,
  duration,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);

    // auto close mobile menu
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <h1 className="logo">Audra MusicPlayer</h1>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === "explore" ? "active" : ""}`}
            onClick={() => handleNavClick("explore")}
          >
            Explore
          </button>

          <button
            className={`nav-item ${activeView === "search" ? "active" : ""}`}
            onClick={() => handleNavClick("search")}
          >
            Search
          </button>
        </nav>

        <MiniPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          setShowPlayer={setShowPlayer}
          currentTime={currentTime}
          duration={duration}
        />
      </aside>
    </>
  );
}
