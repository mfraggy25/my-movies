import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

// imports for files to bundle
import "./registration-view.scss";

export function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    console.log(username, password, birthday, email);
    // Send a request to the server for authentication then call props.onLoggedIn(username)
    props.onLoggedIn(username);
  };

  return (
    <Container className="registrationContainer">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => createEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicUserName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => createUsername(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please choose a username.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => createPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            placeholder="01/01/1990"
            value={birthday}
            value={birthday}
            onChange={e => createDob(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I am not a robot" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}

RegistrationView.propTypes = {
  onSignedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};
