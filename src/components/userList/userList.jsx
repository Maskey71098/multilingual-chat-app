import useFriendsStore from "../../lib/friendStore";
import "./userList.css";

const UserList = ({ user }) => {
  const { setActiveFriend } = useFriendsStore();
  return (
    <div className="userList" onClick={() => setActiveFriend(user)}>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>{user.username}</span>
          <p className="text-secondary">
            {user?.lastMessage ? user?.lastMessage : "Start conversation here!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserList;
