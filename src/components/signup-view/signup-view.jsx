import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function SignupView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = function (event) {
    event.preventDefault();
    setLoading(true);

    const secondPassword = document.querySelector('.secondPassword').value;

    if (secondPassword !== password) {
      toast.error('Passwords do not match. Please try again.');
      console.error("Passwords don't match.");
      return;
    }

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch('localhost:8080/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        setLoading(false);
        if (response.status === 401) {
          throw new Error(
            "Sorry, you're not authorized to access this resource. "
          );
        } else if (response.status === 409) {
          throw new Error(
            'Sorry! This username is already taken. Please choose another one.'
          );
        } else if (response.ok) {
          toast.success('Welcome! You have been registered.');
          setIsRegistered(true);
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to register you. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };

  return (
    <>
      {isRegistered ? (
        <Navigate to="/login" />
      ) : (
        <Card className="card mb-4">
          <Card.Body>
            <Card.Title className="mb-4">Sign up here.</Card.Title>
            <Form className="mb-4" onSubmit={handleSubmit}>
              <Form.Group controlId="signupFormUsername">
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
                <Form.Text>
                  Please choose a username using only alphanumeric characters
                  (letters and numbers).
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="signupFormPassword">
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
              <Form.Group controlId="signupFormSecondPassword">
                <Form.Label>Retype password:</Form.Label>
                <Form.Control
                  className="secondPassword"
                  type="password"
                  required
                />
              </Form.Group>
              <Form.Group controlId="signupFormEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={function (event) {
                    setEmail(event.target.value);
                  }}
                  required
                />
              </Form.Group>
              <Form.Group controlId="signupFormBirthday">
                <Form.Label>Birthday:</Form.Label>
                <Form.Control
                  type="date"
                  value={birthday}
                  onChange={function (event) {
                    setBirthday(event.target.value);
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
                    Register
                  </Button>
                )}
              </div>
            </Form>
            <Link to="/login" className="mt-2">
              Already registered? Log in here.
            </Link>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export { SignupView };
