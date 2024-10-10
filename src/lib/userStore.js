import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const sessionIDSnap = await getDoc(doc(db, "sessions", uid));
        const sessionId = localStorage.getItem("userID");
        if (sessionIDSnap.data().sessionId != sessionId) {
          set({ currentUser: null, isLoading: false });
        } else {
          set({ currentUser: docSnap.data(), isLoading: false });
        }
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
