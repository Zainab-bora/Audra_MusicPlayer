import { useState } from "react";
import MusicCard from "../components/MusicCard";
import AddSongCard from "../components/AddSongCard";
import AddSongModal from "../components/AddSongModal";
import "../styles/home.css";
import AnimatedBackground from "../components/AnimatedBackground";
import LoadingCard from "../components/LoadingCard";

export default function Home({
  title = "Discover",
  songs,
  onSongSelect,
  onAddSong,
  onDeleteSong,
  user,
  signInWithGoogle,
  logoutUser,
  loading,
  favorites,
  toggleFavorite,
}) {
  const [showModal, setShowModal] = useState(false);

  const handleAddSong = (song) => {
    onAddSong(song);
    setShowModal(false);
  };

  return (
    <div className="home">
      <div className="home-header">
        <h2 className="home-title">{title}</h2>

        <div className="home-auth">
          {user ? (
            <div className="home-profile">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="home-avatar"
              />

              <span>{user.displayName}</span>

              <button className="home-auth-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          ) : (
            <button className="home-auth-btn" onClick={signInWithGoogle}>
              Login with Google
            </button>
          )}
        </div>
      </div>

      <div className="music-grid">
        <AddSongCard onAdd={() => setShowModal(true)} />
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        {!loading &&
          songs.map((song) => (
            <MusicCard
              key={song.id}
              song={song}
              onSelect={() => onSongSelect(song)}
              onDelete={onDeleteSong}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
      </div>

      {showModal && (
        <AddSongModal
          onClose={() => setShowModal(false)}
          onSave={handleAddSong}
          user={user}
        />
      )}

      <p className="refresh-note">
        Your songs are safely saved and always ready to play ✨{" "}
      </p>
      <AnimatedBackground />
    </div>
  );
}
