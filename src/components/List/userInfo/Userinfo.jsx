import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";
import AddUser from "../chatList/AddUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Userinfo = () => {
  const { currentUser } = useUserStore();
  const [addUser, setAddUser] = useState(false);
  const handleAddClick = () => {
    setAddUser(!addUser);
  };
  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser?.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className="icons">
        <img src="./edit.png" alt="" />
        <FontAwesomeIcon
          icon="fa-solid fa-user-pen"
          // size="lg"
          style={{ cursor: "pointer" }}
        />
        <FontAwesomeIcon
          icon="fa-solid fa-plus"
          // size=""
          style={{ cursor: "pointer" }}
          onClick={handleAddClick}
        />
        {addUser && <AddUser show={addUser} handleClose={handleAddClick} />}
      </div>
    </div>
  );
};

export default Userinfo;
