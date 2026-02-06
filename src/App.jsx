import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Player from "./components/Player";
import songsData from "./data/songs";
import Search from "./components/Search";

export default function App() {
  const [songs, setSongs] = useState(songsData);
  const [currentSong, setCurrentSong] = useState(null);
  const [activeView, setActiveView] = useState("explore");

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        setCurrentSong={setCurrentSong}
      />

      <main className="main-content">
        {currentSong ? (
          <Player
            songs={songs}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
          />
        ) : activeView === "search" ? (
          <Search songs={songs} onSongSelect={setCurrentSong} />
        ) : activeView === "explore" ? (
          <Home
            songs={songs}
            onSongSelect={setCurrentSong}
            onAddSong={(song) => setSongs((prev) => [song, ...prev])}
            onDeleteSong={(id) =>
              setSongs((prev) => prev.filter((s) => s.id !== id))
            }
          />
        ) : (
          <Search songs={songs} onSongSelect={setCurrentSong} />
        )}
      </main>
    </div>
  );
}
