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
  const currentUser = auth.currentUser;

  return (
    <div className="list">
      <Userinfo />
      <ChatList />
      {friends?.length > 0 ? (
        friends.map((friend, index) => {
          return <UserList key={index} user={friend} />;
        })
      ) : (
        <div>Please Start By Adding New Friends</div>
      )}
    </div>
  );
};

export default List;
