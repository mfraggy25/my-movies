import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './profile-view.scss'

import { Link } from "react-router-dom";

export class ProfileView extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            password: null,
            email: null,
            birthday: null,
            favorites: []
        };
    }

    componentDidMount() {
      let accessToken = localStorage.getItem('token');
      if (accessToken !== null) {
          this.getUserProfile(accessToken);
      }
  }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
  }

    getUserProfile (token) {
        axios.get(`https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem('user')}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                this.setState({
                    username: response.data.username,
                    password: response.data.password,
                    email: response.data.email,
                    birthday: response.data.birthday,
                    favorites: response.data.favourites
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    addToFavorites(e) {
      const { movie } = this.props;
      e.preventDefault();
      axios.post(
        `https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movie._id}`,
        { username: localStorage.getItem('user') },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
          alert(`${movie.Title} successfully added to your favorites`);
        })
        .catch(error => {
          alert(`${movie.Title} not added to your favorites` + error)
        });
    }

    deleteFavorite(movieId) {
        axios.delete(`https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movieId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
          .then(res => {
            document.location.reload(true);
          })
          .then(res => {
            alert('Movie successfully deleted from favorites');
          })
    
          .catch(e => {
            alert('Movie could not be deleted from favorites' + e)
          });
      }

    deleteUser() {
        axios.delete(`https://movieswithmichaelf.herokuapp.com/users/${localStorage.getItem('user')}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          .then(res => {
            alert('Are you sure you want to delete your account?')
          })
          .then(res => {
            alert('Account was successfully deleted')
          })
          .then(res => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
    
            this.setState({
              user: null
    
            });
            window.open('/', '_self');
          })
          .catch(e => {
            alert('Account could not be deleted ' + e)
          });
        }
    }

    return (
      <div>
        <Link to={'/'}>
                    <Button
                        variant="outline-dark"
                    >
                        Back to movie list
                    </Button>
                </Link>
        <Row>
          <Col xs={10} sm={5} md={5}>
            <Form noValidate validated={validated} onSubmit={handleUpdate}>
              {formField('Username', username, setUsername, 'text', '')}
              {formField('Password', password, setPassword, 'password', 'Please provide a password of at least 6 characters.', {minLength: 6})}
              {formField('Email', email, setEmail, 'email', 'Please provide a valid email address.')}
              {formField('Birthday', birthday, setBirthday, 'date', 'Please provide a valid date (e.g. 01/01/1990).')}
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Col>
          <Col xs={10} sm={5} md={5}>
            <Form noValidate validated={validated} onSubmit={handleUnregister}>
              <Button variant="outline-danger" type="submit">
                Unregister
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
