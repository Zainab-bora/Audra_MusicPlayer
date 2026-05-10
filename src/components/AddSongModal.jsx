import { useState } from "react";
import "../styles/addSong.css";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { addSongToFirestore } from "../services/songService";

export default function AddSongModal({ onClose, onSave, user }) {
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!audio) return;

    try {
      setLoading(true);

      // Upload audio file
      const audioUrl = await uploadToCloudinary(audio);

      // Upload cover image if exists
      let coverUrl = null;

      if (cover) {
        coverUrl = await uploadToCloudinary(cover);
      }

      console.log("Audio URL:", audioUrl);
      console.log("Cover URL:", coverUrl);

      const newSong = {
        id: Date.now(),
        title: audio.name.replace(/\.[^/.]+$/, ""),
        artist: artist || "Unknown Artist",
        audio: audioUrl,
        cover: coverUrl,
        lyrics: "",
        userId: user.uid,
      };

      await addSongToFirestore(newSong);

      onSave(newSong);
      onClose();
    } catch (error) {
      console.error("Error uploading song:", error);
    } finally {
      setLoading(false);
    }
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

          <button className="add-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Song"}
          </button>
        </div>
      </div>
    </div>
  );
}
