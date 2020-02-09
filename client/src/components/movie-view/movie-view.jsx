import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import React from "react";
import axios from "axios";
import "./movie-view.scss";

import { Link } from "react-router-dom";

export function MovieView(props) {
  const { movie } = props;
  if (!movie) return null;

  function addToFavourites(event) {
    event.preventDefault();
    axios
      .post(
        `https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}/movies/${movie._id}`,
        {
          Username: localStorage.getItem("user")
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(response => {
        console.log(response);
        alert("Movie added to your Favourite List!");
      })
      .catch(event => {
        console.log("error adding movie to list");
        alert("Error adding movie!");
      });
  }

  return (
    <div>
      <Card style={{ width: "50%" }} className="movie-view">
        <Card.Img variant="top" src={movie.imagepath} />
        <Card.Body>
          <Card.Title className="movie-title">{movie.Title}</Card.Title>
          <Card.Title>{movie.Description}</Card.Title>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">Director</Button>
          </Link>

          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">Genre</Button>
          </Link>
          <Button variant="warning" onClick={event => addToFavourites(event)}>
            {" "}
            Add to Favourites{" "}
          </Button>
          <Link to={`/`}>
            <Button variant="outline-info">Go Back</Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}
