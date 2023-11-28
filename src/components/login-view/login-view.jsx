import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function LoginView({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = function (event) {
    event.preventDefault();
    setLoading(true);

    const data = {
      Username: username,
      Password: password,
    };

    fetch('http://localhost:8080/login', {
      method: 'POST',
      // Specifies content being sent in request body so server can deal with it better
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      // Extracts JWT from response content in JSON format
      .then(function (response) {
        setLoading(false);
        return response.json();
      })
      .then(function (data) {
        if (data.message === 'Incorrect username.') {
          throw new Error(
            'No account with that username. Please try again or sign up with a new account.'
          );
        }
        if (data.message === 'Incorrect password.') {
          throw new Error('Wrong password. Please try again.');
        }
        if (data.user) {
          // Storing user object and token upon successful login
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          // User and token are defined in the API's auth.js file
          onLoggedIn(data.user, data.token);
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while submitting the form. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };

  return (
    <Card className="card mb-4">
      <Card.Body>
        <Card.Title className="mb-4">Login</Card.Title>
        <Form className="mb-4" onSubmit={handleSubmit}>
          <Form.Group controlId="loginFormUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={function (event) {
                setUsername(event.target.value);
              }}
              pattern="[a-zA-Z0-9]+"
              required
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
            {loading ? (
              <Button
                className="spinner-button"
                type="button"
                variant="primary"
              >
                <ButtonSpinner />
              </Button>
            ) : (
              <Button
                className="spinner-button"
                type="submit"
                variant="primary"
              >
                Submit
              </Button>
            )}
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
