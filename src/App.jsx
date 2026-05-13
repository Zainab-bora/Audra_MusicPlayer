import { useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Player from "./components/Player";
import Search from "./components/Search";
import LoadingScreen from "./components/LoadingScreen";

import { getSongsFromFirestore } from "./services/songService";
import { deleteSongFromFirestore } from "./services/songService";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import { signInWithGoogle, logoutUser } from "./services/authService";

import { fetchTrendingSongs } from "./services/deezerService";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [activeView, setActiveView] = useState("explore");
  const [loading, setLoading] = useState(true);

  // Player visibility
  const [showPlayer, setShowPlayer] = useState(false);

  // Global audio state
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [apiSongs, setApiSongs] = useState([]);

  const [apiLoading, setApiLoading] = useState(true);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");

    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (song) => {
    const exists = favorites.find((fav) => fav.id === song.id);

    if (exists) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== song.id));
    } else {
      setFavorites((prev) => [...prev, song]);
    }
  };
  // Fetch songs from Firestore
  useEffect(() => {
    if (!user) {
      setSongs([]);
      setLoading(false);
      return;
    }

    const fetchSongs = async () => {
      try {
        const fetchedSongs = await getSongsFromFirestore(user.uid);

        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Error loading songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user]);

  useEffect(() => {
    const loadApiSongs = async () => {
      try {
        const songs = await fetchTrendingSongs();

        setApiSongs(songs);
      } catch (error) {
        console.error(error);
      } finally {
        setApiLoading(false);
      }
    };

    loadApiSongs();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Handle song change globally
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;

    audio.src = currentSong.audio;
    audio.volume = volume;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    // Auto-play next song
    audio.onended = () => {
      const allSongs = [...songs, ...apiSongs];

      const currentIndex = allSongs.findIndex(
        (song) => song.id === currentSong.id,
      );

      const nextIndex = (currentIndex + 1) % allSongs.length;

      setCurrentSong(allSongs[nextIndex]);
    };
  }, [currentSong, songs]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
  }, [volume]);

  // Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Global Audio */}
      <audio ref={audioRef} />

      <div className="app-layout">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          setCurrentSong={setCurrentSong}
          currentSong={currentSong}
          audioRef={audioRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setShowPlayer={setShowPlayer}
          togglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          setShowPlayer={setShowPlayer}
        />

        <main className="main-content">
          {showPlayer && currentSong ? (
            <Player
              songs={[...songs, ...apiSongs]}
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
              setShowPlayer={setShowPlayer}
              audioRef={audioRef}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              volume={volume}
              setVolume={setVolume}
            />
          ) : activeView === "search" ? (
            <Search
              songs={[...songs, ...apiSongs]}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
            />
          ) : activeView === "explore" ? (
            <Home
              title="Discover"
              songs={[...songs, ...apiSongs]}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
              onAddSong={(song) => setSongs((prev) => [song, ...prev])}
              onDeleteSong={async (id) => {
                await deleteSongFromFirestore(id);

                setSongs((prev) => prev.filter((s) => s.firestoreId !== id));
              }}
              loading={apiLoading}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              user={user}
              signInWithGoogle={signInWithGoogle}
              logoutUser={logoutUser}
            />
          ) : activeView === "favorites" ? (
            <Home
              title="Favorites"
              songs={favorites}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
              onAddSong={(song) => setSongs((prev) => [song, ...prev])}
              onDeleteSong={async (id) => {
                await deleteSongFromFirestore(id);

                setSongs((prev) => prev.filter((s) => s.firestoreId !== id));
              }}
              loading={false}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              user={user}
              signInWithGoogle={signInWithGoogle}
              logoutUser={logoutUser}
            />
          ) : (
            <Search
              songs={[...songs, ...apiSongs]}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </main>
      </div>
    </>
  );
}
