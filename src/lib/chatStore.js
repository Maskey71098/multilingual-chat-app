import { create } from "zustand";
import { db as database } from "./firebase"; // Import your Firebase config
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  or,
  and,
} from "firebase/firestore";

// Define a Message type
const createMessage = ({ senderId, receiverId, text, timestamp }) => ({
  senderId, // The ID of the user sending the message
  receiverId, // The ID of the user receiving the message
  text, // The message content
  timestamp, // The time the message was sent
});

const useChatStore = create((set) => ({
  messages: [],
  user: null,
  error: null, // State to hold error messages

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  loadMessages: (user, friend) => {
    console.log(friend);
    const messagesRef = collection(database, "messages");

    // Create a query to fetch messages where the user is either the sender or receiver
    const messagesQuery = query(
      messagesRef,
      or(
        and(
          where("senderId", "==", user.uid),
          where("receiverId", "==", friend.id)
        ),
        and(
          where("senderId", "==", friend.id),
          where("receiverId", "==", user.uid)
        )
      )
    );

    // Attach a real-time listener to the filtered messages collection
    onSnapshot(messagesQuery, (snapshot) => {
      const messagesArray = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID if needed
        ...doc.data(),
      }));
      const sortedMessages = messagesArray.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      set({ messages: sortedMessages });
    });
  },

  resetMessages: () => {
    console.log("resetting");
    set({ messages: [] });
  },

  sendMessage: async (senderId, receiverId, text) => {
    if (text.trim() === "") return;

    const messagesRef = collection(database, "messages");

    try {
      // Create a message object using the defined schema
      const message = createMessage({
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
      });

      await addDoc(messagesRef, message);
      // Reset error state on successful message send
      set({ error: null });
    } catch (error) {
      console.error("Error sending message:", error);
      // Set the error state
      set({ error: "Failed to send message. Please try again." });
    }
  },
}));

export default useChatStore;
