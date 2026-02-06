export default function AddSongCard({ onAdd }) {
  return (
    <div
      className="music-card add-song"
      onClick={() => {
        console.log("ADD SONG CLICKED");
        onAdd();
      }}
    >
      <div className="add-icon">＋</div>
      <p>Add Song</p>
    </div>
  );
}
