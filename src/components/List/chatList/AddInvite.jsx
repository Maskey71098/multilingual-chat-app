import { useState } from "react";
import { Modal, Button, Form, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const AddInvite = ({ show, handleClose, title, placeholder }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendInvite = (e) => {
    e.preventDefault();

    const SERVICE_ID = "service_148yces"; // Your EmailJS Service ID
    const TEMPLATE_ID = "template_ytnb95r"; // Your EmailJS Template ID
    const USER_ID = "ZXY48rtohXOm6HC5_"; // Your EmailJS User ID

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: email,
          message: message || "You have been invited to join our platform!",
        },
        USER_ID
      )
      .then(
        (result) => {
          toast.success("Invitation sent successfully!");
          setEmail("");
          setMessage("");
          handleClose();
        },
        (error) => {
          console.error("Error sending email:", error);
          toast.error("Failed to send invitation.");
        }
      );
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Invite User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSendInvite}>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder={placeholder || "Enter recipient's email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your invitation message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Send Invite
            </Button>
          </Stack>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddInvite;
