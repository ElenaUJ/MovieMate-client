import { PropTypes } from 'prop-types';

// props argument is destructured/ movie is the name of the prop
function MovieCard({ movie, onMovieClick }) {
  return (
    <div
      onClick={function () {
        onMovieClick(movie);
      }}
    >
      {movie.Title}
    </div>
  );
}

export { MovieCard };

// Prop types contraints
MovieCard.propTypes = {
  // shape({}) means it's an object
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
  onMovieClick: PropTypes.func.isRequired,
};
