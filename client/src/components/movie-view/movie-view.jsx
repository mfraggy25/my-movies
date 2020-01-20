import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
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
      <div className="movie-view">
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src={movie.imagepath} />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Title>{movie.description}</Card.Title>
            <Card.Text>Genre: {movie.genre.name}</Card.Text>
            <Card.Text>Director: {movie.director.name}</Card.Text>
            <Button variant="primary">Go back</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
