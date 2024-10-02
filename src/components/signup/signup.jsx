import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./signup.css";
import * as formik from "formik";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export const Signup = () => {
  const { Formik } = formik;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

// Form validation scheme
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    // file: yup.mixed().required(),
    email: yup.string().email("Invalid email address").required("Required"),
    password: yup
      .string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
      ),
  });

  //Handle form submission
  const handleSignUp = async(values) => {
    setError(null);
    setSuccess(false);
    try{
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log("User signed up:",userCredential.user);
      setSuccess(true);
    } catch(err) {
      console.error("Signup error:", err);
      setError(err.message);
    }
  }

  // // const handleSubmit2 = (event) => {
  // //   const form = event.currentTarget;
  // //   if (form.checkValidity() === false) {
  // //     event.preventDefault();
  // //     event.stopPropagation();
  // //   }
  // // };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <Formik
        validationSchema={schema}
        onSubmit={handleSignUp}
        // onSubmit={console.log}
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="signup-form">
            <Row className="mb-3">
              <Form.Group md="3" controlId="validationFormik04">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Jack"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="validationFormik05">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="test@email.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="validationFormik07">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="***"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Signup successful!</p>}

            <Button variant="dark" type="submit">
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
