import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { UserInfo } from './user-info.jsx';
import { TopMovies } from './top-movies.jsx';
import { UpdateUser } from './update-user.jsx';
import { DeleteUser } from './delete-user.jsx';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function ProfileView({ user, token, setUser, onLoggedOut, movies }) {
  return (
    <>
      <Row>
        <Col>
          <h1>My Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={4}>
          <Card className="card h-100">
            <Card.Body>
              <Card.Title>Your Information</Card.Title>
              <Card.Text>
                <UserInfo
                  username={user.Username}
                  email={user.Email}
                  birthday={user.Birthday.slice(0, 10)}
                />
              </Card.Text>
              <div className="align-right mt-3">
                <DeleteUser
                  user={user}
                  token={token}
                  onLoggedOut={onLoggedOut}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="card">
            <Card.Body>
              <Card.Title>Update Your Information</Card.Title>
              <UpdateUser user={user} token={token} setUser={setUser} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Top Movies</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <TopMovies user={user} movies={movies} />
        </Col>
      </Row>
      <Row>
        <div className="align-right">
          <Button
            as={Link}
            to={`/`}
            variant="secondary"
            className="btn-secondary"
          >
            Back
          </Button>
        </div>
      </Row>
    </>
  );
}

export { ProfileView };

ProfileView.propTypes = {
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
  onLoggedOut: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
      Genre: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
      }).isRequired,
      Director: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Bio: PropTypes.string.isRequired,
        Birth: PropTypes.string.isRequired,
        Death: PropTypes.string,
      }).isRequired,
      ImagePath: PropTypes.string.isRequired,
      Featured: PropTypes.bool.isRequired,
    })
  ).isRequired,
};