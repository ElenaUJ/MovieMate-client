import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';

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
      <img className="w-100 mb-4" src={movie.ImagePath} />
      <div className="align-right">
        <Button variant="primary" onClick={onBackClick}>
          Back
        </Button>
      </div>
    </div>
  );
}

export { MovieView };

MovieView.propTypes = {
  movie: PropTypes.shape({
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
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
