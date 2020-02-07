import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./main-view.scss";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";
import { ProfileUpdate } from "../profile-view/profile-update";
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
      user: null,
      users: [],
      token: "",
      userInfo: {}
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

  getAllUsers(token) {
    axios
      .get("https://movieswithmichaelf.herokuapp.com/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log(response);
        this.setState({
          users: response.data,
          token: token
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    // Persists login data: get value of token from localStorage.
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user")
      });
      this.getMovies(accessToken);
      this.getAllUsers(localStorage.getItem("user"), accessToken);
    }
  }

  // onLoggedIn() updates user state of MainView, will be called when user has logged in.
  // Parameter authData gives user and token
  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });
    // Auth information (= user + token) received from handleLogin method has been saved in localStorage.
    // setItem method accepts two arguments (key and value)
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    // Will get the movies from the API once user is logged in
    this.getMovies(authData.token);
    this.setState({
      userInfo: authData.user
    });
  }

  handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null
    });
    window.open("/", "_self");
  }

  handleProfileUpdate(data) {
    this.setState({
      userInfo: data
    });
    localStorage.setItem("user", data.username);
  }

  render() {
    const { movies, user, users, userInfo, data, token } = this.state;

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
            <Link component={RouterLink} to={`/users/${user}`}>
              <Button variant="outline-dark">Profile</Button>
            </Link>
            <Button variant="primary" onClick={() => this.handleLogout()}>
              Log out
            </Button>
            <Route
              exact
              path="/"
              render={() =>
                movies.map(m => <MovieCard key={m._id} movie={m} />)
              }
            />
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
                  updateUser={data => this.handleProfileUpdate(data)}
                />
              )}
            />
          </div>
        </Router>
      );
    }
  }
}
