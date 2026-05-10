import { useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Player from "./components/Player";
import Search from "./components/Search";

import { getSongsFromFirestore } from "./services/songService";
import { deleteSongFromFirestore } from "./services/songService";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import { signInWithGoogle, logoutUser } from "./services/authService";

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
      const currentIndex = songs.findIndex(
        (song) => song.firestoreId === currentSong.firestoreId,
      );

      const nextIndex = (currentIndex + 1) % songs.length;

      setCurrentSong(songs[nextIndex]);
    };
  }, [currentSong, songs, volume]);

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

  if (loading) {
    return <h2 style={{ color: "white" }}>Loading songs...</h2>;
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
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          setShowPlayer={setShowPlayer}
          currentTime={currentTime}
          duration={duration}
        />

        <main className="main-content">
          {showPlayer && currentSong ? (
            <Player
              songs={songs}
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
              songs={songs}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
            />
          ) : activeView === "explore" ? (
            <Home
              songs={songs}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
              onAddSong={(song) => setSongs((prev) => [song, ...prev])}
              onDeleteSong={async (id) => {
                await deleteSongFromFirestore(id);

                setSongs((prev) => prev.filter((s) => s.firestoreId !== id));
              }}
              user={user}
              signInWithGoogle={signInWithGoogle}
              logoutUser={logoutUser}
            />
          ) : (
            <Search
              songs={songs}
              onSongSelect={(song) => {
                setCurrentSong(song);
                setShowPlayer(true);
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}
