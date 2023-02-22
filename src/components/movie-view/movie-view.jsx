import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

// The entire movies array has to be passed into the MovieView prop because React Router only allows access to
function MovieView({ movies }) {
  // Accesses movieId URL param that has been defined in the movie-card component
  const { movieId } = useParams();
  const movie = movies.find(function (m) {
    return m._id === movieId;
  });
  return (
    <>
      <h1>{movie.Title}</h1>
      <p>
        Director: {movie.Director.Name}
        <br />
        Genre: {movie.Genre.Name}
      </p>
      <p>Description: {movie.Description}</p>
      <img className="w-100 mb-4" src={movie.ImagePath} />
      <Link to={`/`}>
        <div className="align-right">
          <button>Back</button>
        </div>
      </Link>
    </>
  );
}

export { MovieView };

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    // shape({}) means it's an object
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
