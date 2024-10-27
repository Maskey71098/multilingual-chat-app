import UserList from "../../components/userList/userList";
import { auth } from "../../lib/firebase";
import useFriendsStore from "../../lib/friendStore";
import ChatList from "./chatList/ChatList";
import "./list.css";
import Userinfo from "./userInfo/Userinfo";

const List = () => {
  const { friends } = useFriendsStore();

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
