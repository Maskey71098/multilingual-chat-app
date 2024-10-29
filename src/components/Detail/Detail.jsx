import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import useFriendsStore, { IsBlocked } from "../../lib/friendStore";
import "./detail.css";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import useChatStore from "../../lib/chatStore";
import { Image, Modal } from "react-bootstrap";

const Detail = () => {
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (imageSrc) => {
    setCurrentImage(imageSrc);
    setShow(true);
  };
  const { activeFriend, blockUser, unblockUser } = useFriendsStore();
  const currentUser = auth.currentUser;
  const [isBlocked, setIsBlocked] = useState(false);
  const { messages } = useChatStore();
  const messagesWithImages = messages?.filter((item) => item?.imageUrl);

  // Effect to check if the active friend is blocked
  useEffect(() => {
    const checkIfBlocked = async () => {
      if (activeFriend) {
        const blockedStatus = await IsBlocked(currentUser.uid, activeFriend.id);
        setIsBlocked(blockedStatus); // Update state with the blocked status
      }
    };

    checkIfBlocked();
  }, [activeFriend, currentUser.uid]); // Re-run the effect if activeFriend changes

  const handleBlockToggle = async () => {
    try {
      if (isBlocked) {
        await unblockUser(currentUser.uid, activeFriend.id);
      } else {
        await blockUser(currentUser.uid, activeFriend.id);
      }
      // Recheck the blocked status after toggling
      const blockedStatus = await IsBlocked(currentUser.uid, activeFriend.id);
      setIsBlocked(blockedStatus); // Update state after toggling
      toast.success(`User was ${!blockedStatus ? "unblocked" : "blocked"}.`); // Show a success toast
    } catch (error) {
      toast.error("Some error occurred");
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return activeFriend ? (
    <div className="detail">
      <div className="user">
        <img src={activeFriend.avatar || "./avatar.png"} />{" "}
        <h2>{activeFriend.username}</h2>
        <p>this is my status</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span> Chat Setting</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span> Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
      </div>
      <div className="image_container">
        {messagesWithImages?.map((item, index) => {
          return (
            <Image
              key={index}
              src={item?.imageUrl}
              alt="imaaag"
              className="image_url"
              onClick={() => handleShow(item?.imageUrl)}
            />
          );
        })}
      </div>
      <div className="button-container">
        <Button
          onClick={handleBlockToggle}
          variant="dark"
          size="sm"
          style={{ marginBottom: "10px" }}
        >
          {isBlocked ? "Unblock User" : "Block User"}
        </Button>
        <br />

        <Button variant="danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={currentImage} className="modal-image" />
        </Modal.Body>
      </Modal>
    </div>
  ) : (
    <div></div>
  );
};

export default Detail;
