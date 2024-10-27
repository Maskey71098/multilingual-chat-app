import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../../lib/chatStore"; // Import Zustand store
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { auth, storage } from "../../lib/firebase"; // Ensure Firebase Storage is imported
import { IsBlocked } from "../../lib/friendStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage utilities


const Chat = ({ friend }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null); // State to store selected image
  const [uploading, setUploading] = useState(false); // State to show uploading status

  const handleEmoji = (e) => {
    setNewMessage((prev) => prev + e.emoji);
    setOpen(false);
  };

  const { messages, loadInitialMessages, sendMessage, loadMoreMessages } =
 
    useChatStore();
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
      console.log("Sent ");
      
      sendMessage(currentUser.uid, friend.id, newMessage,""); // Send text message
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
      {spinnerLoad && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <div className="center" ref={chatContainerRef} onScroll={handleScroll} >
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
            <FontAwesomeIcon icon="fa-solid fa-gallery" size="lg" />
            <FontAwesomeIcon icon="fa-solid fa-emoji1" size="lg" />
            <FontAwesomeIcon icon="fa-solid fa-images" size="lg" />
            
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
