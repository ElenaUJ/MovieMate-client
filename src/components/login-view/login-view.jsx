import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function LoginView({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = function (event) {
    // Preventing default behaviour which would be to reload entire page
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch('https://myflix-movie-app-elenauj.onrender.com/login', {
      method: 'POST',
      // Specifies content being sent in request body so server can deal with it better
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      // Extracts JWT from response content in JSON format
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('Login response: ', data);

        if (data.user) {
          // After successful login, user object and token will be stored using localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          // User and token are defined in the API's auth.js file!
          onLoggedIn(data.user, data.token);
        } else {
          alert('No such user');
        }
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  return (
    <Card className="card mb-4">
      <Card.Body>
        <Card.Title className="mb-4">Login</Card.Title>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="loginFormUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={function (event) {
                setUsername(event.target.value);
              }}
              required
              pattern="[a-zA-Z0-9]+"
            />
          </Form.Group>
          <Form.Group controlId="loginFormPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={function (event) {
                setPassword(event.target.value);
              }}
              required
            />
          </Form.Group>
          <div className="align-right mt-3">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
        <Link to="/signup">Not registered yet? Sign up here.</Link>
      </Card.Body>
    </Card>
  );
}

export { LoginView };

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};
