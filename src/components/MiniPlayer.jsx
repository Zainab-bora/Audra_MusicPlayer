import "../styles/miniplayer.css";

import defaultCover from "../assets/default-cover.jpeg";

export default function MiniPlayer({
  currentSong,
  isPlaying,
  togglePlay,
  setShowPlayer,
  currentTime,
  duration,
}) {
  if (!currentSong) return null;

  return (
    <div className="mini-player" onClick={() => setShowPlayer(true)}>
      <img
        src={currentSong.cover || defaultCover}
        alt={currentSong.title}
        className="mini-cover"
      />

      <div className="mini-info">
        <h4>{currentSong.title}</h4>
        <p>{currentSong.artist}</p>
      </div>

      <div className="mini-controls">
        <button
          onClick={(e) => {
            e.stopPropagation();

            togglePlay();
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
      <div className="mini-progress">
        <div
          className="mini-progress-fill"
          style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}
