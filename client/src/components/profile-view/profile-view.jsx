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
    this.state = {};
  }

  deleteMovieFromFavs(event, favoriteMovie) {
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
    const { movie, userInfo, FavoriteMovies = [] } = this.props;

    return (
      <Card className="profile-view" style={{ width: "24rem" }}>
        <Card.Body>
          <Card.Title>My Profile</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>Username: {userInfo.Username}</ListGroup.Item>
            <ListGroup.Item>Password:******* </ListGroup.Item>
            <ListGroup.Item>Email: {userInfo.Email}</ListGroup.Item>
            <ListGroup.Item>
              Birthday: {userInfo.Birthday && userInfo.Birthday.slice(0, 10)}
            </ListGroup.Item>
            <ListGroup.Item>
              Favourite Movies:
              {FavoriteMovies.length === 0 && (
                <p>No Favourite Movies have been added</p>
              )}
              {FavoriteMovies.length > 0 &&
                FavoriteMovies.map(favoriteMovie => (
                  <ListGroup.Item>
                    {movie.Title}
                    <Link to={`/movies/${movie._id}`}>
                      <Button variant="info">View</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => this.deleteMovieFromFavs(movie._id)}
                    >
                      Delete
                    </Button>
                  </ListGroup.Item>
                ))}
            </ListGroup.Item>
          </ListGroup>
          <div className="text-center">
            <Link to={`/`}>
              <Button className="button-back" variant="outline-info">
                Go back
              </Button>
            </Link>
            <Link to={`/update/:Username`}>
              <Button className="button-update" variant="outline-secondary">
                Update profile
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }
}
