import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./login.css";

export const Login = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="login-form"
      >
        <Row className="mb-3">
          <Form.Group controlId="validationCustom013">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="test@email.com" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="validationCustom014">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="*****" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button type="submit">Sign In</Button>
      </Form>
    </div>
  );
};
