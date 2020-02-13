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
    axios
      .get(
        `https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}`,
        {
          username: localStorage.getItem("user")
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        console.log(response);
        this.setState({
          userInfo: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          Favorites: response.data.Favorites
        });
      })
      .catch(error => {
        console.log("tested", error);
      });
  }

  deleteFavouriteMovie(event, Favorite) {
    event.preventDefault();
    axios
      .delete(
        `https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}/movies/${Favorite}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(response => {
        this.getUser(localStorage.getItem("token"));
        alert("Movie deleted!");
      })
      .catch(function(error) {
        alert("Something went wrong!");
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    const { username, email, birthday, Favorites = [] } = this.state;

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
                      <ListGroup.Item
                        className="profile-view-fave-movies"
                        key={Favorite}
                      >
                        <p>
                          {
                            JSON.parse(localStorage.getItem("movies")).find(
                              movie => movie._id === Favorite
                            ).Title
                          }
                        </p>
                        <Link to={`/movies/${Favorite}`}>
                          <Button size="sm" variant="info">
                            Open
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={event =>
                            this.deleteFavouriteMovie(event, Favorite)
                          }
                        >
                          Delete
                        </Button>
                      </ListGroup.Item>
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
