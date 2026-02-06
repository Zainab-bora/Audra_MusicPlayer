import { useState } from "react";
import MusicCard from "../components/MusicCard";
import AddSongCard from "../components/AddSongCard";
import AddSongModal from "../components/AddSongModal";
import "../styles/home.css";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home({ songs, onSongSelect, onAddSong, onDeleteSong }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddSong = (song) => {
    onAddSong(song);
    setShowModal(false);
  };

  return (
    <div className="home">
      <h2 className="home-title">Discover</h2>

      <div className="music-grid">
        <AddSongCard onAdd={() => setShowModal(true)} />

        {songs.map((song) => (
          <MusicCard
            key={song.id}
            song={song}
            onSelect={() => onSongSelect(song)}
            onDelete={onDeleteSong}
          />
        ))}
      </div>

      {showModal && (
        <AddSongModal
          onClose={() => setShowModal(false)}
          onSave={handleAddSong}
        />
      )}

      <p className="refresh-note">
        Added songs are stored temporarily and may disappear on refresh.
      </p>
      <AnimatedBackground />
    </div>
  );
}
