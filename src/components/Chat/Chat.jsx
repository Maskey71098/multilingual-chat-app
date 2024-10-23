import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../../lib/chatStore"; // Import Zustand store
import "./chat.css";

import { auth } from "../../lib/firebase";
import { IsBlocked } from "../../lib/friendStore";
import { toast } from "react-toastify";

const Chat = ({ friend }) => {
  const { messages, loadInitialMessages, sendMessage, loadMoreMessages } =
    useChatStore();
  const currentUser = auth.currentUser;
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  const isLoadingMore = useRef(false);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (friend) {
      loadInitialMessages(currentUser, friend); // Load messages when component mounts
    }
  }, [loadInitialMessages, currentUser, friend]);

  useEffect(() => {
    if (!isLoadingMore.current) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async () => {
    // Check if the current user has blocked the friend
    const userBlocked = await IsBlocked(currentUser.uid, friend.id);
    // Check if the friend has blocked the current user
    const friendBlocked = await IsBlocked(friend.id, currentUser.uid);

    if (userBlocked) {
      // user blocked friend
      toast.error("You need to unblock the user before sending a message.");
      return;
    } else if (friendBlocked) {
      // friend blocked user
      toast.error(
        "You cannot send a message. You might be blocked by the other user."
      );
      return;
    }

    // Proceed to send the message
    sendMessage(currentUser.uid, friend.id, newMessage); // Use Zustand action to send message
    setNewMessage(""); // Clear input field
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0) {
      isLoadingMore.current = true; // Indicate that more messages are being loaded

      // Save the current scroll height before loading more messages
      const previousScrollHeight = chatContainerRef.current.scrollHeight;
      loadMoreMessages(currentUser, friend);

      // Delay to wait for the messages to load, then restore scroll position
      setTimeout(() => {
        const currentScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop =
          currentScrollHeight - previousScrollHeight;
        isLoadingMore.current = false; // Loading complete
      }, 200); // Adjust timeout as needed
    }
  };

  return friend ? (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>{friend ? friend.username : "User"}</span>
            <p>you are now on chat</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center" ref={chatContainerRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <div
            className={`message ${
              message.senderId === currentUser.uid ? "own" : ""
            }`}
            key={index}
          >
            {message.senderId !== currentUser.uid && (
              <img src="./avatar.png" alt="" />
            )}
            <div className="texts">
              <p>{message.text}</p>
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the form from refreshing the page
          handleSendMessage(); // Call your send message function
        }}
      >
        <div className="bottom">
          <div className="icons">
            <img src="./mic.png" alt="Microphone" />
            <img src="/img.png" alt="Image" />
            <img src="/images.png" alt="translate" />
          </div>
          <input
            type="text"
            placeholder="type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="sendButton">
          Send
        </button>
      </form>
    </div>
  ) : (
    <div> </div>
  );
};

export default Chat;
