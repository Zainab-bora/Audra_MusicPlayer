import "../styles/home.css";
import defaultCover from "../assets/default-cover.jpeg";

export default function MusicCard({ song, onSelect, onDelete }) {
  return (
    <div className="music-card" onClick={onSelect}>
      <img
        src={song.cover || defaultCover}
        alt={song.title}
        className="album-art"
      />

      <h4 className="song-title">{song.title}</h4>
      <p className="artist">{song.artist}</p>
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(song.id);
        }}
      >
        🗑
      </button>
    </div>
  );
}
