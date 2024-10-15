import { create } from "zustand";
import { db } from "./firebase"; // Make sure to adjust the import according to your file structure
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IsBlocked } from "./friendStore";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,

  // Fetch user info based on UID
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      set({ currentUser: null, isLoading: false });
    }
  },

  // Function to set current user in the store
  setUser: (user) => set({ currentUser: user, isLoading: false }),
}));
