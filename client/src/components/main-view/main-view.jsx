import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./main-view.scss";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";

export class MainView extends React.Component {
  // One of the "hooks" available in a React Component
  constructor(props) {
    //Call the superclass constructor
    // so React can initialize it
    super(props);

    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      register: false
    };
  }

  getMovies(token) {
    axios
      .get("https://movieswithmichaelf.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getUser(token) {
    axios
      .get("https://movieswithmichaelf.herokuapp.com/users/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setLoggedUser(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleProfileUpdate(data) {
    this.setState({
      userInfo: data
    });
    localStorage.setItem("user", data.username);
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user")
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  render() {
    const { movies, user, userInfo, token } = this.state;

    if (!movies) return <div className="main-view" />;
    if (!user) {
      return (
        <Router>
          <div className="main-view">
            <Route
              exact
              path="/"
              render={() => (
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              )}
            />
            <Route path="/register" render={() => <RegistrationView />} />
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div className="main-view">
            <Route
              exact
              path="/"
              render={() => {
                if (!user)
                  return (
                    <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                  );
                return <MoviesList movies={movies} />;
              }}
            />
            <Route path="/register" render={() => <RegistrationView />} />
            <Route
              path="/movies/:movieId"
              render={({ match }) => (
                <MovieView
                  movie={movies.find(m => m._id === match.params.movieId)}
                />
              )}
            />
            <Route
              path="/directors/:name"
              render={({ match }) => {
                if (!movies || !movies.length)
                  return <div className="main-view" />;
                return (
                  <DirectorView
                    director={
                      movies.find(m => m.Director.Name === match.params.name)
                        .Director
                    }
                  />
                );
              }}
            />
            <Route
              path="/genres/:name"
              render={({ match }) => {
                if (!movies || !movies.length)
                  return <div className="main-view" />;
                return (
                  <GenreView
                    genre={
                      movies.find(m => m.Genre.Name === match.params.name).Genre
                    }
                  />
                );
              }}
            />
            <Route
              path="/users/:Username"
              render={({ match }) => {
                return <ProfileView userInfo={userInfo} />;
              }}
            />
            <Route
              path="/update/:Username"
              render={() => (
                <ProfileUpdate
                  userInfo={userInfo}
                  user={user}
                  token={token}
                  updateUser={data => this.updateUser(data)}
                />
              )}
            />
          </div>
        </Router>
      );
    }
  }
}
