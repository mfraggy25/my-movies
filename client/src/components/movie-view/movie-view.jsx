import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import React from "react";
import "./movie-view.scss";

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
            <Card.Text>Genre: {movie.Genre.Name}</Card.Text>
            <Card.Text>Director: {movie.Director.Name}</Card.Text>
            <Card.Text>Director Bio: {movie.Director.Bio}</Card.Text>
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
