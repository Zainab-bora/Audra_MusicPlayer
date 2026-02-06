import { useRef, useState, useEffect } from "react";
import "../styles/player.css";
import AnimatedBackground from "../components/AnimatedBackground";
import defaultCover from "../assets/default-cover.jpeg";

export default function Player({ songs, currentSong, setCurrentSong }) {
  if (!currentSong) return null;

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const currentIndex = songs.findIndex((s) => s.id === currentSong.id);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    audio.pause();
    audio.src = currentSong.audio;
    audio.load();
    audio.volume = volume;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    setCurrentTime(0);
  }, [currentSong]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const playPrev = () => {
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    setCurrentSong(songs[prevIndex]);
  };

  return (
    <div className="player">
      {/* CD */}
      <div className="cd-container">
        <div className={`cd-glow ${isPlaying ? "active" : ""}`}>
          <div
            className={`cd ${!isPlaying ? "paused" : ""}`}
            style={{
              backgroundImage: `url(${currentSong.cover || defaultCover})`,
            }}
          />
        </div>
      </div>

      <div className="song-info">
        <button className="back-btn" onClick={() => setCurrentSong(null)}>
          ← Back
        </button>

        <h2>{currentSong.title}</h2>
        <p>{currentSong.artist}</p>

        <audio
          ref={audioRef}
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        />

        <div className="controls">
          <button onClick={playPrev}>⏮</button>

          <button onClick={togglePlay} className="play-btn">
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <button onClick={playNext}>⏭</button>
        </div>

        <input
          className="progress"
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
            setCurrentTime(e.target.value);
          }}
        />

        <div className="volume-control">
          <span className="volume-icon">
            {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const v = e.target.value;
              setVolume(v);
              audioRef.current.volume = v;
            }}
          />
        </div>

        <div className="lyrics">
          {currentSong.lyrics || "Lyrics not available 🎶"}
        </div>
        <p className="note">Playback ends when you leave the player.</p>
      </div>
      <AnimatedBackground />
    </div>
  );
}
