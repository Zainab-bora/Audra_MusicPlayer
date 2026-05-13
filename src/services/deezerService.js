export const fetchTrendingSongs = async () => {
  try {
    const queries = [
      "pop",
      "kpop",
      "hiphop",
      "rock",
      "weeknd",
      "ariana",
      "drake",
      "lofi",
    ];

    let allSongs = [];

    for (const query of queries) {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "c63ce6427bmshec9769b2d46ae73p106113jsn8bea3c02e216",
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
          },
        },
      );

      const data = await response.json();

      const mappedSongs = data.data.slice(0, 5).map((song) => ({
        id: `deezer-${song.id}`,
        title: song.title,
        artist: song.artist.name,
        audio: song.preview,
        cover: song.album.cover_big,
        lyrics: "",
        isApiSong: true,
      }));

      allSongs = [...allSongs, ...mappedSongs];
    }

    return allSongs;
  } catch (error) {
    console.error("Error fetching Deezer songs:", error);

    return [];
  }
};
