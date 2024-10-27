import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../../lib/chatStore"; // Import Zustand store
import "./chat.css";

import { auth } from "../../lib/firebase";
import { IsBlocked } from "../../lib/friendStore";
import { toast } from "react-toastify";

const Chat = ({ friend }) => {
  const { messages, loadMessages, sendMessage } = useChatStore();
  const currentUser = auth.currentUser;
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [spinnerLoad, setSpinnerLoad] = useState(false);
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
    const userBlocked = await IsBlocked(currentUser.uid, friend.id);
    const friendBlocked = await IsBlocked(friend.id, currentUser.uid);

    if (userBlocked) {
      toast.error("You need to unblock the user before sending a message.");
      return;
    } else if (friendBlocked) {
      toast.error("You cannot send a message. You might be blocked by the other user.");
      return;
    }

    if (image) {
      setUploading(true); // Set uploading to true while uploading the image
      try {
        const imageRef = ref(storage, `images/${currentUser.uid}/${image.name}`);
        await uploadBytes(imageRef, image); // Upload image to Firebase Storage
        const imageUrl = await getDownloadURL(imageRef); // Get the image URL after upload

        sendMessage(currentUser.uid, friend.id, null, imageUrl); // Send message with image URL
        setImage(null); // Clear the image input
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
      } finally {
        setUploading(false); // Set uploading to false after completion
      }
    } else {
      sendMessage(currentUser.uid, friend.id, newMessage); // Send text message
      setNewMessage("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store selected image in state
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0) {
      isLoadingMore.current = true; // Indicate that more messages are being loaded
      setSpinnerLoad(true);
      // Save the current scroll height before loading more messages
      const previousScrollHeight = chatContainerRef.current.scrollHeight;
      loadMoreMessages(currentUser, friend);

      // Delay to wait for the messages to load, then restore scroll position
      setTimeout(() => {
        const currentScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop =
          currentScrollHeight - previousScrollHeight;
        isLoadingMore.current = false; // Loading complete
        setSpinnerLoad(false);
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
          <FontAwesomeIcon icon="fa-solid fa-phone" size="lg" />
          <FontAwesomeIcon icon="fa-solid fa-video" size="lg" />
          <FontAwesomeIcon icon="fa-solid fa-circle-info" size="lg" />
        </div>
      </div>
      {spinnerLoad && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <div className="center" ref={chatContainerRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <div
            className={`message ${message.senderId === currentUser.uid ? "own" : ""}`}
            key={index}
          >
            {message.senderId !== currentUser.uid && <img src="./avatar.png" alt="" />}
            <div className="texts">
              {message.imageUrl ? (
                <img src={message.imageUrl} alt="Sent" className="sent-image" />
              ) : (
                <p>{message.text}</p>
              )}
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="bottom">
          <div className="icons">
            <img src="./mic.png" alt="Microphone" />
            <img src="/img.png" alt="Image" />
            <img src="/images.png" alt="translate"/>
          </div>
          <img src="/images.png" alt="translate"/>
          <input
            type="text"
            placeholder="type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={uploading} // Disable input while uploading
          />
        </div>
        <button type="submit" className="sendButton">
          Send
        </button>
      </form>
    </div>
  ) : (
    <div></div>
  );
};

export default Chat;
