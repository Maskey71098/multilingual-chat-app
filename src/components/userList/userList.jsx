import "./userList.css";

const UserList = ({ user }) => {
  console.log(user);
  return (
    <div className="userList">
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>{user?.user?.username}</span>
          <p className="text-secondary">
            {user?.lastMessage ? user?.lastMessage : "Start conversation here!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserList;
