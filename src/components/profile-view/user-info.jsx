import { PropTypes } from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function UserInfo({ birthday, email, username }) {
  return (
    <Col>
      <Row className="mb-2">
        <Col xs={4}>Name:</Col>
        <Col xs={8}>{username}</Col>
      </Row>
      <Row className="mb-2">
        <Col xs={4}>E-mail:</Col>
        <Col xs={8}>{email}</Col>
      </Row>
      <Row className="mb-2">
        <Col xs={4}>Birthday:</Col>
        <Col xs={8}>{birthday}</Col>
      </Row>
    </Col>
  );
}

export { UserInfo };

UserInfo.propTypes = {
  birthday: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
