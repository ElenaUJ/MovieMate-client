import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';

function DeleteUser({ user, token, onDeregistered }) {
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
  return (
    <Button type="button" variant="danger" onClick={deleteUser}>
      Delete account
    </Button>
  );
}

export { DeleteUser };

DeleteUser.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
  token: PropTypes.string.isRequired,
  onDeregistered: PropTypes.func.isRequired,
};
