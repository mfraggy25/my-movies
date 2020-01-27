import React from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./profile-view.scss";

import { Link } from "react-router-dom";

export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      favoriteMovies: []
    };
  }

  componentDidMount() {
    //authentication
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem("user");
    axios
      .get(`https://movieswithmichaelf/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.setState({
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favoriteMovies: response.data.Favorites
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  addToFavorites(e) {
    const { movie } = this.props;
    e.preventDefault();
    axios
      .post(
        `https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}/Movies/${movie._id}`,
        { username: localStorage.getItem("user") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(res => {
        alert(`${movie.Title} successfully added to your favorites`);
      })
      .catch(error => {
        alert(`${movie.Title} not added to your favorites` + error);
      });
  }

  deleteMovieFromFavs(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios
      .delete(
        `https://movieswithmichaelf/users/${localStorage.getItem(
          "user"
        )}/Favorites/${favoriteMovie}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(response => {
        this.getUser(localStorage.getItem("token"));
      })
      .catch(event => {
        alert("Something went wrong!");
      });
  }

  deleteUser() {
    axios
      .delete(
        `https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(res => {
        alert("Are you sure you want to delete your account?");
      })
      .then(res => {
        alert("Account was successfully deleted");
      })
      .then(res => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        this.setState({
          user: null
        });
        window.open("/", "_self");
      })
      .catch(e => {
        alert("Account could not be deleted " + e);
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { username, email, birthday, favoriteMovies } = this.state;

    return (
      <Card style={{ width: "25rem" }}>
        <Card.Img variant="top" />
        <Card.Body>
          <Card.Title>My Profile</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>Username: {username}</ListGroup.Item>
            <ListGroup.Item>Password:******* </ListGroup.Item>
            <ListGroup.Item>Email: {email}</ListGroup.Item>
            <ListGroup.Item>
              Birthday: {birthday && birthday.slice(0, 10)}
            </ListGroup.Item>
            <ListGroup.Item>
              Favorite Movies:
              <div>
                {favoriteMovies.length === 0 && (
                  <div>No Favourite Movies have been added</div>
                )}
                {favoriteMovies.length > 0 && (
                  <ul>
                    {favoriteMovies.map(favoriteMovie => (
                      <li key={favoriteMovie}>
                        <p>
                          {
                            JSON.parse(localStorage.getItem("movies")).find(
                              movie => movie._id === favoriteMovie
                            ).Title
                          }
                        </p>
                        <Link to={`/movies/${favoriteMovie}`}>
                          <Button variant="info">Open</Button>
                        </Link>
                        <Button
                          variant="secondary"
                          onClick={event =>
                            this.deleteMovieFromFavs(event, favoriteMovie)
                          }
                        >
                          Delete
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ListGroup.Item>
          </ListGroup>
          <Form>
            <div>
              <p>Please update your information below:</p>
            </div>
            <Form.Group controlId="formNewUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Form.Text>
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                placeholder="MM/DD/YYYY"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
              />
            </Form.Group>
            <div>
              <Button variant="secondary" type="submit" onClick={handleUpdate}>
                Update
              </Button>
              <Button variant="danger" type="submit" onClick={handleDelete}>
                Delete profile
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}
