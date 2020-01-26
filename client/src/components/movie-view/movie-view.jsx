import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import React from "react";
import "./movie-view.scss";

import { Link } from "react-router-dom";

export class MovieView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { movie, onClick } = this.props;
    if (!movie) return null;

    return (
      <div>
        <Card style={{ width: "50%" }}>
          <Card.Img variant="top" src={movie.imagepath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Title>{movie.Description}</Card.Title>
            <Link to={`/directors/${movie.Director.Name}`}>
              <Button variant="link">Director</Button>
            </Link>

            <Link to={`/genres/${movie.Genre.Name}`}>
              <Button variant="link">Genre</Button>
            </Link>
            <Button
              variant="primary"
              onClick={() => onClick()}
              className="homeButton"
            >
              Go back
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
