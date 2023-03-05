import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function UpdateUser({ user, token, setUser }) {
  const [usernameUpdate, setUsernameUpdate] = useState('');
  const [passwordUpdate, setPasswordUpdate] = useState('');
  const [emailUpdate, setEmailUpdate] = useState('');
  const [birthdayUpdate, setBirthdayUpdate] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = function (event) {
    event.preventDefault();
    setLoading(true);

    // // const secondPassword = document.querySelector('.secondPassword').value;

    // if (secondPassword !== password) {
    //   alert('Passwords do not match');
    //   return;
    // }

    // Only will send keys in the update objects that were actually updated in the form fields
    const data = {};
    if (usernameUpdate) {
      data.Username = usernameUpdate;
    }
    if (passwordUpdate) {
      data.Password = passwordUpdate;
    }
    if (emailUpdate) {
      data.Email = emailUpdate;
    }
    if (birthdayUpdate) {
      data.Birthday = birthdayUpdate;
    }
    // Don't fetch if update object is empty
    if (Object.keys(data).length === 0) {
      setLoading(false);
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
        setLoading(false);
        console.log(data);
        if (response.ok) {
          console.log('Response from API: ' + response.json());
          alert('Successfully updated!');
          setUser(function (prevUser) {
            // Object.assign combines prevUser object (2nd argument) with new data (3rd argument) in new object (first argument)
            return Object.assign({}, prevUser, data);
          });
          setUsernameUpdate('');
          setPasswordUpdate('');
          setEmailUpdate('');
          setBirthdayUpdate('');
        } else {
          console.log('Update failed.');
          alert('Update failed.');
        }
      })
      .catch(function (error) {
        setLoading(false);
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
            value={usernameUpdate}
            onChange={function (event) {
              setUsernameUpdate(event.target.value);
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
            value={passwordUpdate}
            onChange={function (event) {
              setPasswordUpdate(event.target.value);
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
            value={emailUpdate}
            onChange={function (event) {
              setEmailUpdate(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="updateFormBirthday">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control
            type="date"
            value={birthdayUpdate}
            onChange={function (event) {
              setBirthdayUpdate(event.target.value);
            }}
          />
        </Form.Group>
        <div className="align-right mt-3">
          {loading ? (
            <Button variant="primary" type="button" className="spinner-button">
              <ButtonSpinner />
            </Button>
          ) : (
            <Button variant="primary" type="submit" className="spinner-button">
              Update
            </Button>
          )}
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
