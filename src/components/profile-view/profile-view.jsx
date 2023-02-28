import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { MovieCard } from '../movie-card/movie-card.jsx';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function ProfileView({ user, token, setUser, onDeregistered, movies }) {
  const printBirthday = user.Birthday.slice(0, 10);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = function (event) {
    event.preventDefault();

    // // const secondPassword = document.querySelector('.secondPassword').value;

    // if (secondPassword !== password) {
    //   alert('Passwords do not match');
    //   return;
    // }

    // Only will send keys in the update objects that were actually updated in the form fields
    const data = {};
    if (username) {
      data.Username = username;
    }
    if (password) {
      data.Password = password;
    }
    if (email) {
      data.Email = email;
    }
    if (birthday) {
      data.Birthday = birthday;
    }

    fetch(
      `https://myflix-movie-app-elenauj.onrender.com/users/${user.Username}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
      .then(function (response) {
        console.log(data);
        if (response.ok) {
          console.log('Response from API: ' + response.json());
          alert('Successfully updated!');
          setUser(function (prevUser) {
            // Object.assign combines prevUser object (2nd argument) with new data (3rd argument) in new object (first argument)
            return Object.assign({}, prevUser, data);
          });
          setUsername('');
          setPassword('');
          setEmail('');
          setBirthday('');
        } else {
          console.log('Update failed.');
          alert('Update failed.');
        }
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  const deleteUser = function () {
    fetch(
      `https://myflix-movie-app-elenauj.onrender.com/users/${user.Username}`,
      {
        method: 'DELETE',
        headers: {
          // Question: Do I need this here? Is it just for the request?
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(function (response) {
        if (response.ok) {
          console.log('User was successfully deleted.');
          alert('Successfully deleted!');
          onDeregistered();
        } else if (response.status === 401) {
          console.log('Unauthorized');
          alert('Unauthorized.');
          throw new Error('Unauthorized.');
        } else {
          console.log('Deregistration failed.');
          alert('Deregistration failed.');
        }
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  let topMovies = movies.filter(function (movie) {
    console.log(user.TopMovies);
    return user.TopMovies.includes(movie._id);
  });

  return (
    <>
      <h1>My Profile</h1>
      <Row>
        <Col md={6}>
          <Card className="card">
            <Card.Body>
              <Card.Title>My user information</Card.Title>
              <Card.Text>
                Username: {user.Username}
                <br />
                Email: {user.Email}
                <br />
                Birthday: {printBirthday}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card">
            <Card.Body>
              <Card.Title>Update user information</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="updateFormUsername">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={function (event) {
                      setUsername(event.target.value);
                    }}
                    pattern="[a-zA-Z0-9]+"
                  />
                  <Form.Text>
                    Please choose a username using only alphanumeric characters
                    (letters and numbers).
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="updateFormPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={function (event) {
                      setPassword(event.target.value);
                    }}
                  />
                </Form.Group>
                {/* <Form.Group controlId="signupFormSecondPassword">
                  <Form.Label>Retype password:</Form.Label>
                  <Form.Control
                    className="secondPassword"
                    type="password"
                    required
                  />
                </Form.Group> */}
                <Form.Group controlId="updateFormEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={function (event) {
                      setEmail(event.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="updateFormBirthday">
                  <Form.Label>Birthday:</Form.Label>
                  <Form.Control
                    type="date"
                    value={birthday}
                    onChange={function (event) {
                      setBirthday(event.target.value);
                    }}
                  />
                </Form.Group>
                <div className="align-right mt-3">
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </div>
              </Form>
              <Button type="button" variant="danger" onClick={deleteUser}>
                Delete account
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <h1>My favourite movies</h1>
        {topMovies.map(function (movie) {
          return (
            <Col className="mt-4" key={movie._id} md={3} sm={4} xs={6}>
              <MovieCard movie={movie} />
            </Col>
          );
        })}
      </Row>
      <div className="align-right">
        <Button
          as={Link}
          to={`/`}
          variant="secondary"
          className="btn-secondary"
        >
          Back
        </Button>
      </div>
    </>
  );
}

export { ProfileView };

ProfileView.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
  token: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
  onDeregistered: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
      Genre: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
      }).isRequired,
      Director: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Bio: PropTypes.string.isRequired,
        Birth: PropTypes.string.isRequired,
        Death: PropTypes.string,
      }).isRequired,
      ImagePath: PropTypes.string.isRequired,
      Featured: PropTypes.bool.isRequired,
    })
  ).isRequired,
};
