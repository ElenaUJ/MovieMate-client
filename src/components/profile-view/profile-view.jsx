import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { DeleteUser } from './delete-user.jsx';
import { TopMovies } from './top-movies.jsx';
import { UpdateUser } from './update-user.jsx';
import { UserInfo } from './user-info.jsx';

function ProfileView({
  movies,
  onLoggedOut,
  removeMovie,
  setUser,
  token,
  user,
}) {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>Your Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col className="mb-4" xs={12} sm={6} md={4}>
          <Card className="card h-100">
            <Card.Body className="flex-column">
              <Card.Title className="mb-3">Your Information</Card.Title>
              <UserInfo
                birthday={user.Birthday.slice(0, 10)}
                email={user.Email}
                username={user.Username}
              />
              <div className="align-right mt-auto">
                <DeleteUser
                  onLoggedOut={onLoggedOut}
                  token={token}
                  user={user}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col className="mb-4" xs={12} sm={6} md={8}>
          <Card className="card">
            <Card.Body>
              <Card.Title className="mb-3">Update Your Information</Card.Title>
              <UpdateUser setUser={setUser} token={token} user={user} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">
          <h2>Your Top Movies</h2>
        </Col>
      </Row>
      <Row>
        <TopMovies movies={movies} removeMovie={removeMovie} user={user} />
      </Row>
      <Row className="mb-4 mt-3">
        <div className="align-right">
          <Button
            className="btn-secondary"
            as={Link}
            to={`/`}
            variant="secondary"
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
  onLoggedOut: PropTypes.func.isRequired,
  removeMovie: PropTypes.func.isRequired,
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
