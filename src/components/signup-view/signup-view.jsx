import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Navigate, Link } from 'react-router-dom';

function SignupView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = function (event) {
    event.preventDefault();

    const secondPassword = document.querySelector('.secondPassword').value;

    if (secondPassword !== password) {
      alert('Passwords do not match');
      return;
    }

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch('https://myflix-movie-app-elenauj.onrender.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.ok) {
          console.log(response.json());
          alert('Successfully registered!');
          setIsRegistered(true);
        } else {
          console.log('Registration failed.');
          alert('Registration failed.');
        }
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  return (
    <>
      {isRegistered ? (
        <Navigate to="/login" />
      ) : (
        <Card className="card mt-5 mb-4">
          <Card.Body>
            <Card.Title className="mb-4">Sign up here.</Card.Title>
            <Form onSubmit={handleSubmit} className="mb-4">
              <Form.Group controlId="signupFormUsername">
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
                <Button variant="primary" type="submit">
                  Register
                </Button>
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
