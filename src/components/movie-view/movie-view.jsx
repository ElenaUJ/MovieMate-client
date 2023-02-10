import { PropTypes } from 'prop-types';

function MovieView({ movie, onBackClick }) {
  return (
    <div>
      <h1>{movie.Title}</h1>
      <p>
        Director: {movie.Director.Name}
        <br />
        Genre: {movie.Genre.Name}
      </p>
      <p>Description: {movie.Description}</p>
      <img src={movie.Image} />
      <br />
      <button onClick={onBackClick}>Back</button>
    </div>
  );
}

export { MovieView };

MovieView.propTypes = {
  movie: PropTypes.shape({
    Id: PropTypes.string.isRequired,
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
    Image: PropTypes.string.isRequired,
    Featured: PropTypes.bool.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
