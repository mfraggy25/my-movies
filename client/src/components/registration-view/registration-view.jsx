import React, { useState } from 'react';
import PropTypes from 'prop-types';

// imports for files to bundle
import './registration-view.scss';

export function RegistrationView(props) {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ birthday, setBirthday ] = useState('');
}
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    RegistrationView.propTypes = {
        onNewUserRegistered: PropTypes.func.isRequired
      };