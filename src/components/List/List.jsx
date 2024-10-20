import { useEffect, useState } from "react";
import UserList from "../../components/userList/userList";
import ChatList from "./chatList/ChatList";
import "./list.css";
import Userinfo from "./userInfo/Userinfo";
import { useUserStore } from "../../lib/userStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import useFriendsStore from "../../lib/friendStore";

const List = () => {
  const { friends } = useFriendsStore();
  const [input, setInput] = useState("");
  const filteredFriends = friends?.filter((c) =>
    c.username.toLowerCase().includes(input.toLowerCase())
  );
  const currentUser = auth.currentUser;

  return (
    <div className="list">
      <Userinfo />
      <ChatList setInput={setInput} />
      {filteredFriends?.length > 0 ? (
        filteredFriends?.map((friend, index) => {
          return <UserList key={index} user={friend} />;
        })
      ) : input ? (
        <div>Friend Not Found!</div>
      ) : (
        <div>Please Start By Adding New Friends</div>
      )}
    </div>
  );
};

export default List;
