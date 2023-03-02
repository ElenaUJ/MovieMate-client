import { PropTypes } from 'prop-types';
import { MovieCard } from '../movie-card/movie-card.jsx';
import Col from 'react-bootstrap/Col';

function TopMovies({ user, movies }) {
  let topMovies = movies.filter(function (movie) {
    console.log(user.TopMovies);
    return user.TopMovies.includes(movie._id);
  });

  return (
    <>
      {topMovies.map(function (movie) {
        return (
          <Col className="mt-4" key={movie._id} md={3} sm={4} xs={6}>
            <MovieCard movie={movie} />
          </Col>
        );
      })}
    </>
  );
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
};
