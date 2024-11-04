import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../../lib/chatStore";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { auth, storage } from "../../lib/firebase";
import { IsBlocked } from "../../lib/friendStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Chat = ({ friend }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [spinnerLoad, setSpinnerLoad] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState({}); // Pinned messages by friend ID

  const chatContainerRef = useRef(null);
  const messageRefs = useRef({}); // Refs for each message for locating pinned messages
  const isLoadingMore = useRef(false);
  const audioRef = useRef(new Audio("/notification.mp3"));
  const lastMessageRef = useRef(null);

  const { messages, loadInitialMessages, sendMessage, loadMoreMessages } =
    useChatStore();
  const currentUser = auth.currentUser;

  const handleEmoji = (e) => {
    setNewMessage((prev) => prev + e.emoji);
    setOpen(false);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (friend) {
      loadInitialMessages(currentUser, friend);
    }
  }, [loadInitialMessages, currentUser, friend]);

  useEffect(() => {
    if (!isLoadingMore.current) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (
        latestMessage.senderId !== currentUser.uid &&
        latestMessage.timestamp !== lastMessageRef.current
      ) {
        audioRef.current.play();
        toast.info("New message received!");
        lastMessageRef.current = latestMessage.timestamp;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const userBlocked = await IsBlocked(currentUser.uid, friend.id);
    const friendBlocked = await IsBlocked(friend.id, currentUser.uid);

    if (userBlocked) {
      toast.error("You need to unblock the user before sending a message.");
      return;
    } else if (friendBlocked) {
      toast.error(
        "You cannot send a message. You might be blocked by the other user."
      );
      return;
    }

    if (image) {
      setUploading(true);
      try {
        const imageRef = ref(
          storage,
          `images/${currentUser.uid}/${image.name}`
        );
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        sendMessage(currentUser.uid, friend.id, null, imageUrl);
        setImage(null);
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      sendMessage(currentUser.uid, friend.id, newMessage, "");
      setNewMessage("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0) {
      isLoadingMore.current = true;
      setSpinnerLoad(true);
      const previousScrollHeight = chatContainerRef.current.scrollHeight;
      loadMoreMessages(currentUser, friend);

      setTimeout(() => {
        const currentScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop =
          currentScrollHeight - previousScrollHeight;
        isLoadingMore.current = false;
        setSpinnerLoad(false);
      }, 200);
    }
  };

  const handlePinMessage = (message) => {
    setPinnedMessages((prevPinned) => {
      const friendPinnedMessages = prevPinned[friend.id] || [];
      const isPinned = friendPinnedMessages.some(
        (msg) => msg.id === message.id
      );

      return {
        ...prevPinned,
        [friend.id]: isPinned
          ? friendPinnedMessages.filter((msg) => msg.id !== message.id) // Unpin if already pinned
          : [...friendPinnedMessages, message], // Pin new message
      };
    });
  };

  const locatePinnedMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement && chatContainerRef.current) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("highlight");
      setTimeout(() => {
        messageElement.classList.remove("highlight");
      }, 2000); // Highlight lasts for 2 seconds
    }
  };

  return friend ? (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={friend?.avatar || "./avatar.png"} alt={`${friend.username}'s avatar`} />
          <div className="texts">
            <span>{friend ? friend.username : "User"}</span>
            <p>You are now on chat</p>
          </div>
        </div>
        <div className="icons">
          <FontAwesomeIcon icon="fa-solid fa-phone" size="lg" />
          <FontAwesomeIcon icon="fa-solid fa-video" size="lg" />
          <FontAwesomeIcon icon="fa-solid fa-circle-info" size="lg" />
        </div>
      </div>
      {pinnedMessages[friend.id]?.length > 0 && (
        <div className="pinned-messages">
          <h4>Pinned Messages</h4>
          {pinnedMessages[friend.id].map((msg, index) => (
            <div key={index} className="pinned-message" onClick={() => locatePinnedMessage(msg.id)}>
              {msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="Pinned"
                  className="pinned-image"
                />
              ) : (
                <p>{msg.text}</p>
              )}
              <button onClick={() => handlePinMessage(msg)}>Unpin</button>
            </div>
          ))}
        </div>
      )}
      {spinnerLoad && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <div className="center" ref={chatContainerRef} onScroll={handleScroll}>
        {messages?.map((message, index) => (
          <div
            className={`message ${message.senderId === currentUser.uid ? "own" : ""}`}
            key={index}
            ref={(el) => (messageRefs.current[message.id] = el)}
            onClick={() => handlePinMessage(message)}
          >
            {message.senderId !== currentUser.uid && (
              <img src={friend?.avatar || "./avatar.png"} alt="Sender Avatar" />
            )}
            <div className="texts">
              {message.imageUrl ? (
                <img src={message.imageUrl} alt="Sent" className="sent-image" />
              ) : (
                <p>{message.text}</p>
              )}
              <span>
              {new Date(message.timestamp).toLocaleDateString()}{" "}
              {new Date(message.timestamp).toLocaleTimeString()}
              </span>
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
            <div className="emoji">
              <img
                src="./emoji1.png"
                alt="Emoji"
                onClick={() => setOpen((prev) => !prev)}
              />
              <div className="picker">
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <label htmlFor="imageInput">
              <img src="/gallery.png" alt="Image" />
            </label>
            <input
              type="file"
              id="imageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <img src="images.png" alt="Translate"/>
          <input
            type="text"
            placeholder="type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={uploading}
          />
          {image && <p>{image.name}</p>}
          <button type="submit" className="sendButton" disabled={uploading}>
            {uploading ? "Uploading..." : image ? "Send Image" : "Send"}
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div></div>
  );
};

export default Chat;
