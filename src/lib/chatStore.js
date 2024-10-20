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
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

// Define a Message type
const createMessage = ({ senderId, receiverId, text, timestamp }) => ({
  senderId, // The ID of the user sending the message
  receiverId, // The ID of the user receiving the message
  text, // The message content
  timestamp, // The time the message was sent
});

const useChatStore = create((set, get) => ({
  messages: [],
  user: null,
  lastVisible: null, // Track the last fetched message for pagination
  error: null, // State to hold error messages

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  loadInitialMessages: (user, friend) => {
    console.log(friend);
    const messagesRef = collection(database, "messages");

    // Create a query to fetch the first 5 messages where the user is either the sender or receiver
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
      ),
      orderBy("timestamp", "desc"),
      limit(5) // Fetch only 5 messages initially
    );

    // Attach a real-time listener to the filtered messages collection
    onSnapshot(messagesQuery, (snapshot) => {
      const messagesArray = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID if needed
        ...doc.data(),
      }));

      // Save the last visible document for pagination

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      const sortedMessages = messagesArray.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      set({ messages: sortedMessages, lastVisible });
    });
  },

  loadMoreMessages: (user, friend) => {
    const { lastVisible } = get(); // Get the last visible message from the state
    if (!lastVisible) return;
    const messagesRef = collection(database, "messages");

    // Create a query to fetch the next 5 messages starting after the last visible one
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
      ),

      orderBy("timestamp", "desc"),
      startAfter(lastVisible), // Continue from the last message fetched
      limit(5) // Fetch 5 more messages
    );

    onSnapshot(messagesQuery, (snapshot) => {
      const messagesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Save the last visible document for further pagination
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      const sortedMessages = messagesArray.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      set((state) => ({
        messages: [...sortedMessages, ...state.messages], // Append new messages at the top
        lastVisible,
      }));
    });
  },

  resetMessages: () => {
    console.log("resetting");
    set({ messages: [], lastVisible: null }); // Reset pagination when resetting messages
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
