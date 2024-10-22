import React, { useEffect, useState } from "react";
import useChatStore from "../../lib/chatStore"; // Import Zustand store
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { auth, storage } from "../../lib/firebase"; // Ensure Firebase Storage is imported
import { IsBlocked } from "../../lib/friendStore";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage utilities

const Chat = ({ friend }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null); // State to store selected image
  const [uploading, setUploading] = useState(false); // State to show uploading status

  const handleEmoji = (e) => {
    setNewMessage((prev) => prev + e.emoji);
    setOpen(false);
  };

  const { messages, loadMessages, sendMessage } = useChatStore(); // Assume `sendMessage` can handle image URLs too
  const currentUser = auth.currentUser;
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (friend) {
      loadMessages(currentUser, friend); // Load messages when component mounts
    }
  }, [loadMessages, friend]);

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
            <div className="emoji">
              <img
                src="./emoji.png"
                alt="Emoji"
                onClick={() => setOpen((prev) => !prev)}
              />
              <div className="picker">
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <label htmlFor="imageInput">
              <img src="/img.png" alt="Image" />
            </label>
            <input
              type="file"
              id="imageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload} // Handle image upload
            />
          </div>
          <img src="/images.png" alt="translate"/>
          <input
            type="text"
            placeholder="type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={uploading} // Disable input while uploading
          />
          {image && <p>{image.name}</p>} {/* Display selected image name */}
        </div>
        <button type="submit" className="sendButton" disabled={uploading}>
          {uploading ? "Uploading..." : image ? "Send Image" : "Send"}
        </button>
      </form>
    </div>
  ) : (
    <div></div>
  );
};

export default Chat;
