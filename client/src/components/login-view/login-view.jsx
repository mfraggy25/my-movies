import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

import "./login-view.scss";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("https://movieswithmichaelf.herokuapp.com/login", {
        Username: username,
        Password: password
      })
      // Send a request to the server for authentication then call props.onLoggedIn(username)
      .then(response => {
        const data = response.data;
        console.log("Logged in");
        props.onLoggedIn(username);
      })
      .catch(e => {
        console.log("no such user");
      });
  };

  return (
    <Container className="loginContainer">
      <h1>Welcome to My Movies database! Please login to view.</h1>
      <Form>
        <Form.Group controlId="formUserName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" id="loginButton" onClick={handleSubmit}>
          Submit
        </Button>
        <Form.Group controlId="newUser">
          <Form.Text>Don´t have an account?</Form.Text>
          <Link to={"/register"}>
            <Button variant="secondary" type="link">
              Register
            </Button>
          </Link>
        </Form.Group>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};
