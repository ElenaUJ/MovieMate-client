import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function UpdateUser({ user, token, setUser }) {
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
    // Don't fetch if update object is empty
    if (Object.keys(data).length === 0) {
      console.log('No updates.');
      alert('No inputs found.');
      return;
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

  // Question: Why don't I have to send username etc as props?
  return (
    <>
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
            Please choose a username using only alphanumeric characters (letters
            and numbers).
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
    </>
  );
}

export { UpdateUser };

UpdateUser.propTypes = {
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
};
