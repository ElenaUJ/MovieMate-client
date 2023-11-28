import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function UpdateUser({ setUser, token, user }) {
  const [usernameUpdate, setUsernameUpdate] = useState('');
  const [passwordUpdate, setPasswordUpdate] = useState('');
  const [emailUpdate, setEmailUpdate] = useState('');
  const [birthdayUpdate, setBirthdayUpdate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = function (event) {
    event.preventDefault();
    setLoading(true);

    // Only send keys in the update objects that were actually updated in the form fields
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
    // If data object is empty, don't perform fetch
    if (Object.keys(data).length === 0) {
      setLoading(false);
      toast.error('Please fill in at least one field to update.');
      console.error('Error: No fields filled.');
      return;
    }

    fetch(`http://localhost:8080/users/${user.Username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
          toast.success('Your information has been updated successfully!');
          setUser(function (prevUser) {
            // Object.assign combines prevUser object (2nd argument) with new data (3rd argument) in new object (first argument)
            return Object.assign({}, prevUser, data);
          });
          setUsernameUpdate('');
          setPasswordUpdate('');
          setEmailUpdate('');
          setBirthdayUpdate('');
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to update. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };

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
            <Button className="spinner-button" type="button" variant="primary">
              <ButtonSpinner />
            </Button>
          ) : (
            <Button className="spinner-button" type="submit" variant="primary">
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
  setUser: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
};
