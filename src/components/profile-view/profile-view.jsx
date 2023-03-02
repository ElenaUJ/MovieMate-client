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
import './profile-view.scss';

function ProfileView({
  user,
  token,
  setUser,
  onLoggedOut,
  movies,
  removeMovie,
}) {
  return (
    <>
      <Row>
        <Col>
          <h1>My Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} md={4}>
          <Card className="card h-100">
            <Card.Body className="user-info">
              <Card.Title className="mb-3">Your Information</Card.Title>
              <UserInfo
                username={user.Username}
                email={user.Email}
                birthday={user.Birthday.slice(0, 10)}
              />
              <div className="align-right mt-auto">
                <DeleteUser
                  user={user}
                  token={token}
                  onLoggedOut={onLoggedOut}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={8}>
          <Card className="card">
            <Card.Body>
              <Card.Title className="mb-3">Update Your Information</Card.Title>
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
        <TopMovies user={user} movies={movies} removeMovie={removeMovie} />
      </Row>
      <Row className="mb-4">
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
  removeMovie: PropTypes.func.isRequired,
};
