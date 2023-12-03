import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function DeleteUser({ onLoggedOut, token, user }) {
  const [loading, setLoading] = useState(false);

  const deleteUser = function () {
    setLoading(true);
    fetch(
      `http://MyVPCLoadBalancer-1116653646.us-east-1.elb.amazonaws.com/users/${user.Username}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(function (response) {
        setLoading(false);
        if (response.status === 401) {
          throw new Error(
            "Sorry, you're not authorized to access this resource. "
          );
        } else if (response.status === 400) {
          throw new Error('User was not found.');
        } else if (response.ok) {
          toast.success(
            `You successfully deleted the account with the username of "${user.Username}".`
          );
          onLoggedOut();
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to delete. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
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
