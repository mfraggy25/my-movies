import React from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
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
      userInfo: null,
      Favorites: []
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
      .get(`https://movieswithmichaelf.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("testing", response);
        this.setState({
          userInfo: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favorites: response.data.Favorites
        });
      })
      .catch(error => {
        console.log("tested", error);
      });
  }

  deleteFavouriteMovie(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios
      .delete(
        `https://movieswithmichaelf.herokuapp.com/users${localStorage.getItem(
          "user"
        )}/movies/${favoriteMovie}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(_response => {
        this.getUser(localStorage.getItem("token"));
      })
      .catch(_event => {
        alert("Oops... something went wrong...");
      });
  }

  render() {
    const { userInfo, username, email, birthday, Favorites = [] } = this.state;
    console.log("viewing profile", Favorites);

    return (
      <Card className="profile-view" style={{ width: "24rem" }}>
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
              Favourite Movies:
              <div>
                {Favorites.length === 0 && (
                  <div>No Favourite Movies have been added</div>
                )}
                {Favorites.length > 0 && (
                  <ul>
                    {Favorites.map(Favorite => (
                      <li key={favoriteMovie}>
                        <p>
                          {
                            JSON.parse(localStorage.getItem("movies")).find(
                              movie => movie._id === Favorite
                            ).Title
                          }
                        </p>
                        <Button
                          variant="secondary"
                          onClick={event =>
                            this.deleteFavouriteMovie(event, favoriteMovie)
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
          <div className="text-center">
            <Link to={`/`}>
              <Button variant="outline-info">Go back</Button>
            </Link>
            <Link to={`/update/:Username`}>
              <Button variant="outline-secondary">Update profile</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }
}
