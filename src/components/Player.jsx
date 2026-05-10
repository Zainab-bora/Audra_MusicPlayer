import { useState, useEffect } from "react";

import "../styles/player.css";

import AnimatedBackground from "../components/AnimatedBackground";

import defaultCover from "../assets/default-cover.jpeg";

export default function Player({
  songs,
  currentSong,
  setCurrentSong,
  setShowPlayer,
  audioRef,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
}) {
  if (!currentSong) return null;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentIndex = songs.findIndex((s) => s.id === currentSong.id);

  // Sync progress bar with global audio
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [audioRef]);

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
        <button className="back-btn" onClick={() => setShowPlayer(false)}>
          ← Back
        </button>

        <h2>{currentSong.title}</h2>
        <p>{currentSong.artist}</p>

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
      </div>

      <AnimatedBackground />
    </div>
  );
}
