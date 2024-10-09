import { useState } from "react";
import "./chatList.css";
import AddUser from "./addUser";
import { Form, Stack } from "react-bootstrap";

const ChatList = () => {
  const [addUser, setAddUser] = useState(false);
  const handleAddClick = () => {
    setAddUser(!addUser);
  };
  return (
    <>
      <Stack
        direction="horizontal"
        className="my-2 justify-content-between me-2"
        gap={2}
      >
        <img src="/search.png" alt="" className="fixed-icons" />
        <Form.Control type="text" placeholder="Search" name="Search" />{" "}
        <img
          src="/plus.png"
          alt=""
          onClick={handleAddClick}
          className="fixed-icons"
        />
      </Stack>

      {addUser && <AddUser show={addUser} handleClose={handleAddClick} />}
    </>
  );
};
export default ChatList;
