import React from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./director-view.scss";

import { Link } from "react-router-dom";

/**
 * Director information view
 * @param {string} props - this.props director.Name
 * @returns {DirectorView}
 */
export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { director } = this.props;

    if (!director) return null;

    return (
      <Card className="director-info" style={{ width: "12rem" }}>
        <Card.Body>
          <Card.Title className="director-name">{director.Name}</Card.Title>
          <Card.Text>
            Biography: <br />
            {director.Bio}
            <br />
            <br />
            Born: {director.Birth}
            <br />
            Died: {director.Death}
          </Card.Text>
          <div>
            <Link to={`/`}>
              <Button variant="info">Back</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }
}
