import { useState } from "react";
import MusicCard from "../components/MusicCard";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Search({
  songs,
  onSongSelect,
  favorites,
  toggleFavorite,
}) {
  const [query, setQuery] = useState("");

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ color: "white", marginBottom: "16px" }}>Search</h2>

      <input
        type="text"
        placeholder="Search by song or artist..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: "#0f1f24",
          color: "white",
          border: "1px solid rgba(0,210,216,0.4)",
          marginBottom: "24px",
        }}
      />

      <div className="music-grid">
        {filteredSongs.length ? (
          filteredSongs.map((song) => (
            <MusicCard
              key={song.id}
              song={song}
              onSelect={() => onSongSelect(song)}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p style={{ color: "#888" }}>No matching songs found</p>
        )}
      </div>
      <AnimatedBackground />
    </div>
  );
}
