import { PropTypes } from 'prop-types';
import { MovieCard } from '../movie-card/movie-card.jsx';
import Col from 'react-bootstrap/Col';

function TopMovies({ user, movies, removeMovie }) {
  let topMovies = movies.filter(function (movie) {
    console.log(user.TopMovies);
    return user.TopMovies.includes(movie._id);
  });

  let printTopMovies;
  // Checking if there are similar movies at all
  if (topMovies.length === 0) {
    printTopMovies = (
      <Col className="mt-4">You have not added any movies yet.</Col>
    );
  } else {
    printTopMovies = topMovies.map(function (movie) {
      return (
        <Col
          className="mt-4"
          key={movie._id}
          xl={2}
          lg={3}
          md={4}
          sm={6}
          xs={6}
        >
          <MovieCard
            movie={movie}
            isFavMovieCard={true}
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
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
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
