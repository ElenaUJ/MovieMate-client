import { PropTypes } from 'prop-types';
import Col from 'react-bootstrap/Col';
import { MovieCard } from '../movie-card/movie-card.jsx';

function TopMovies({ movies, removeMovie, user }) {
  let topMovies = movies.filter(function (movie) {
    return user.TopMovies.includes(movie._id);
  });
  let printTopMovies;

  if (topMovies.length === 0) {
    printTopMovies = (
      <Col className="mt-4">You have not added any movies yet.</Col>
    );
  } else {
    printTopMovies = topMovies.map(function (movie) {
      return (
        <Col className="mt-4" key={movie._id} xs={6} md={4} lg={3} xl={2}>
          <MovieCard
            isFavMovieCard={true}
            movie={movie}
            removeMovie={removeMovie}
          />
        </Col>
      );
    });
  }

  return <>{printTopMovies}</>;
}

export { TopMovies };

TopMovies.propTypes = {
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
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
};
