import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

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