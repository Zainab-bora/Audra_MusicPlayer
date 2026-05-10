import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
const songsCollection = collection(db, "songs");

export const addSongToFirestore = async (song) => {
  try {
    const docRef = await addDoc(songsCollection, song);

    console.log("Song saved with ID:", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("Error adding song:", error);
  }
};

export const getSongsFromFirestore = async (userId) => {
  try {
    const q = query(collection(db, "songs"), where("userId", "==", userId));

    const snapshot = await getDocs(q);

    const songs = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

export const deleteSongFromFirestore = async (id) => {
  try {
    await deleteDoc(doc(db, "songs", id));

    console.log("Song deleted successfully");
  } catch (error) {
    console.error("Error deleting song:", error);
  }
};
