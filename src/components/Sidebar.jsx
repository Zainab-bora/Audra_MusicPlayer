import "../styles/sidebar.css";

export default function Sidebar({ activeView, setActiveView, setCurrentSong }) {
  const handleNavClick = (view) => {
    setActiveView(view);
    setCurrentSong(null);
  };

  return (
    <aside className="sidebar">
      <h1 className="logo">Echo Music</h1>

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
    </aside>
  );
}
