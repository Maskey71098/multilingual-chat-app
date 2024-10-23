import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./chatList.css";
import { Form, Stack } from "react-bootstrap";

const ChatList = () => {
  return (
    <>
      <Stack
        direction="horizontal"
        className="my-2 justify-content-between me-2"
        gap={2}
      >
        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
        <Form.Control type="text" placeholder="Search" name="Search" />{" "}
      </Stack>
    </>
  );
};
export default ChatList;
