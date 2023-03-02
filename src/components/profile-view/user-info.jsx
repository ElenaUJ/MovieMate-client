import { PropTypes } from 'prop-types';
import Table from 'react-bootstrap/Table';

function UserInfo({ username, email, birthday }) {
  return (
    <Table responsive borderless>
      <tbody>
        <tr>
          <td>Name:</td>
          <td>{username}</td>
        </tr>
        <tr>
          <td>E-mail:</td>
          <td>{email}</td>
        </tr>
        <tr>
          <td>Birthday:</td>
          <td>{birthday}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export { UserInfo };

UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
};
