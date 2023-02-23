import { PropTypes } from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

// props argument is destructured/ movie is the name of the prop
function MovieCard({ movie }) {
  // Bootstrap utility class h-100 sets moviecards to 100% -- same size
  // Typically, tepmplate literal ${movie._id} would be enough, but encodeURIComponent makes non-alphanumeric characters URL-compatible
  return (
    <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
      <Card className="h-100">
        <Card.Img src={movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>by {movie.Director.Name}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
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
};
