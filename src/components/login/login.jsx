import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

//Login template
export const Login = () => {
  const [validated, setValidated] = useState(false);
  const auth = getAuth();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setError(null);
    setSuccess(null);
    const formData = new FormData(event.target);
    const { email, password } = Object.fromEntries(formData.entries());

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setSuccess(true);
      })
      .catch((error) => {
        setError("Invalid credentials!! Try again");
      });
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
            <Form.Control
              type="email"
              name="email"
              placeholder="test@email.com"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group controlId="validationCustom014">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="*****"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Login successful!</p>}

        <Button type="submit">Sign In</Button>
      </Form>
    </div>
  );
};
