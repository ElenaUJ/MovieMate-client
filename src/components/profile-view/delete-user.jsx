import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function DeleteUser({ onLoggedOut, token, user }) {
  const [loading, setLoading] = useState(false);

  const deleteUser = function () {
    setLoading(true);
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
        setLoading(false);
        if (response.ok) {
          console.log('User was successfully deleted.');
          alert('Successfully deleted!');
          onLoggedOut();
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
        setLoading(false);
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };
  return (
    <>
      {loading ? (
        <Button className="spinner-button-wide" type="button" variant="danger">
          <ButtonSpinner />
        </Button>
      ) : (
        <Button
          className="spinner-button-wide"
          onClick={deleteUser}
          type="button"
          variant="danger"
        >
          Delete account
        </Button>
      )}
    </>
  );
}

export { DeleteUser };

DeleteUser.propTypes = {
  onLoggedOut: PropTypes.func.isRequired,
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
