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
  const handleNavClick = (view) => {
    setActiveView(view);
  };

  return (
    <aside className="sidebar">
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
  );
}
