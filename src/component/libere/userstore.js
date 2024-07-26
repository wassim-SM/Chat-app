
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useuserStore = create((set) => ({
  currentUser: true,
  isLoding: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      console.log("No UID provided, setting currentUser to null.");
      return set({ currentUser: null, isLoding: false });
    }
    try {
      console.log("Fetching user info for UID:", uid);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User data found:", docSnap.data());
        set({ currentUser: docSnap.data(), isLoding: false });
      } else {
        console.log("No user data found.");
        set({ currentUser: null, isLoding: false });
      }
    } catch (err) {
      console.log("Error fetching user info:", err);
      set({ currentUser: null, isLoding: false });
    }
  },
}));