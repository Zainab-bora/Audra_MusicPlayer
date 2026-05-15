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
    <div className="search-page">
      <h2 className="search-title">Search</h2>

      <input
        type="text"
        placeholder="Search by song or artist..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <div className="music-grid">
        {filteredSongs.length ? (
          filteredSongs.map((song, index) => (
            <MusicCard
              key={`${song.id}-${index}`}
              song={song}
              onSelect={() => onSongSelect(song)}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p className="no-results">No matching songs found</p>
        )}
      </div>

      <AnimatedBackground />
    </div>
  );
}
