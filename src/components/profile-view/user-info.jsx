import { PropTypes } from 'prop-types';

function UserInfo({ username, email, birthday }) {
  return (
    <>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Birthday: {birthday}</p>
    </>
  );
}

export { UserInfo };

UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
};
