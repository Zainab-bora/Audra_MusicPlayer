import { useState } from "react";
import "../styles/addSong.css";
import { fileToBase64 } from "../utils/fileToBase64";

export default function AddSongModal({ onClose, onSave }) {
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [artist, setArtist] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async () => {
    if (!audio) return;

    const audioBase64 = await toBase64(audio);
    const coverBase64 = cover ? await toBase64(cover) : null;

    const newSong = {
      id: Date.now(),
      title: audio.name.replace(/\.[^/.]+$/, ""),
      artist: artist || "Unknown Artist",
      audio: audioBase64,
      cover: coverBase64,
      lyrics: "",
    };

    onSave(newSong);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Song</h3>

        <div className="field">
          <label>🎵 Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
          />
        </div>

        <div className="field">
          <label>🖼 Cover Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files[0])}
          />
        </div>

        <div className="field">
          <label>🎤 Artist Name</label>
          <input
            type="text"
            placeholder="e.g. TXT, Moon Tones"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={handleSubmit}>
            Add Song
          </button>
        </div>
      </div>
    </div>
  );
}
