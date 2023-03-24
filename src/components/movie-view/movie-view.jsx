import { PropTypes } from 'prop-types';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { HeartSwitch } from '@anatoliygatt/heart-switch';
import { MovieCard } from '../movie-card/movie-card.jsx';
import './movie-view.scss';

function MovieView({ addMovie, movies, removeMovie, topmovies }) {
  // Accessing movieId URL param that has been defined in the movie-card component
  const { movieId } = useParams();
  const movie = movies.find(function (movie) {
    return movie._id === movieId;
  });

  // Checking if movie is already in user's top movies and setting Liked state, then handling heart switch toggle
  let isLiked = topmovies.includes(movieId);
  const handleToggle = function (isLiked, movieId) {
    if (!isLiked) {
      addMovie(movieId);
    } else if (isLiked) {
      removeMovie(movieId);
    }
  };

  // Printing similar movies array
  let similarMovies = movies.filter(function (similarMovie) {
    return (
      similarMovie.Genre.Name === movie.Genre.Name &&
      similarMovie.Title !== movie.Title
    );
  });
  let printSimilarMovies;

  if (similarMovies.length === 0) {
    printSimilarMovies = (
      <Col className="mt-4">No similar movies in database.</Col>
    );
  } else {
    printSimilarMovies = similarMovies.map(function (movie) {
      return (
        <Col className="mt-4" key={movie._id} xs={6} md={4} lg={3} xl={2}>
          <MovieCard movie={movie}></MovieCard>
        </Col>
      );
    });
  }

  // Makes back button navigate to previous page (either MainView or ProfileView)
  const navigate = useNavigate();
  const goBack = function () {
    return navigate(-1);
  };

  return (
    <>
      <Row>
        <Col className="flex-column mb-4" xs={12} lg={8}>
          <Row>
            <Col>
              <h1>{movie.Title}</h1>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs={2}>Director:</Col>
            <Col>{movie.Director.Name}</Col>
          </Row>
          <Row className="mt-2">
            <Col xs={2}>Genre:</Col>
            <Col>{movie.Genre.Name}</Col>
          </Row>
          <Row className="display-block mb-4 mt-4">
            <Col>{movie.Description}</Col>
          </Row>
          <Row className="mt-auto">
            <Col>
              <HeartSwitch
                activeThumbColor="#ecfeff"
                activeTrackFillColor="#f7be16"
                activeTrackStrokeColor="#A78D5C"
                inactiveThumbColor="#ecfeff"
                inactiveTrackFillColor="#FFEECA"
                inactiveTrackStrokeColor="#A78D5C"
                checked={isLiked}
                onChange={function (event) {
                  event.preventDefault();
                  handleToggle(isLiked, movieId);
                }}
                size="md"
              />
            </Col>
            <Col>
              <div className="align-right">
                <Button
                  className="btn-secondary"
                  onClick={goBack}
                  variant="secondary"
                >
                  Back
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
        <Col className="mb-4" xs={12} lg={4}>
          <img src={movie.ImagePath} className="w-100" />
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          <h2>Similar movies</h2>
        </Col>
      </Row>
      <Row>{printSimilarMovies}</Row>
    </>
  );
}

export { MovieView };

MovieView.propTypes = {
  addMovie: PropTypes.func.isRequired,
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
  topmovies: PropTypes.arrayOf(PropTypes.string).isRequired,
};
