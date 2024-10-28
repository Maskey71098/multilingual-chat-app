import { create } from "zustand";
import { db as database, db } from "./firebase"; // Import your Firebase config

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
  writeBatch,
  doc,
} from "firebase/firestore";

// Define a Message type
const createMessage = ({
  senderId,
  receiverId,
  text,
  timestamp,
  imageUrl,
}) => ({
  senderId, // The ID of the user sending the message
  receiverId, // The ID of the user receiving the message
  text, // The message content
  timestamp, // The time the message was sent
  imageUrl, // The image url sent
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
    const messagesRef = collection(database, "messages");

    // Create a query to fetch the first 10 messages where the user is either the sender or receiver
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
      limit(10) // Fetch only 10 messages initially
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
      limit(10) // Fetch 10 more messages
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

  sendMessage: async (senderId, receiverId, text, imageUrl) => {
    if (text !== null && text.trim() === "") return;
    console.log(imageUrl);

    const messagesRef = collection(database, "messages");
    const senderDocRef = doc(db, "users", senderId);
    const receiverDocRef = doc(db, "users", receiverId);

    try {
      // Create a message object using the defined schema
      const message = createMessage({
        senderId,
        receiverId,
        text,
        imageUrl,
        timestamp: new Date().toISOString(),
      });
      await addDoc(messagesRef, message);

      //Update lastMessage for both sender and receiver documents
      const lastMessageData = {
        text: message?.text,
        timestamp: message?.timestamp,
        imageUrl,
      };

      // Use a Firestore batch to perform both updates in a single operation
      const batch = writeBatch(db);
      batch.update(senderDocRef, { lastMessage: lastMessageData });
      batch.update(receiverDocRef, { lastMessage: lastMessageData });

      await batch.commit();

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
