import React, { useEffect, useState } from "react";
import useChatStore from "../../lib/chatStore"; // Import Zustand store
import "./chat.css";

import { auth } from "../../lib/firebase";
import { IsBlocked } from "../../lib/friendStore";
import { toast } from "react-toastify";

const Chat = ({ friend }) => {
  const { messages, loadMessages, sendMessage } = useChatStore();
  const currentUser = auth.currentUser;
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (friend) {
      loadMessages(currentUser, friend); // Load messages when component mounts
    }
  }, [loadMessages, friend]);

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
      <div className="center">
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
            <img src="/images.png" alt="translate"/>
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
