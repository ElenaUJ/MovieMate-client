import { PropTypes } from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function UserInfo({ username, email, birthday }) {
  return (
    <Col>
      <Row className="mb-2">
        <Col xs={4} sm={12} lg={4}>
          Name:
        </Col>
        <Col xs={8} sm={12} lg={8}>
          {username}
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xs={4} sm={12} lg={4}>
          E-mail:
        </Col>
        <Col xs={8} sm={12} lg={8}>
          {email}
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xs={4} sm={12} lg={4}>
          Birthday:
        </Col>
        <Col xs={8} sm={12} lg={8}>
          {birthday}
        </Col>
      </Row>
    </Col>
  );
}

export { UserInfo };

UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
};
