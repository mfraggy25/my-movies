import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
  // Send a request to the server for authentication then call props.onLoggedIn(username)
    props.onLoggedIn(username);
};

  return (
    <Form>
  <Form.Group controlId="formUserName">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Enter username" />
    <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>
  <Form.Group controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};