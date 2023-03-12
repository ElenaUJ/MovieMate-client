import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';

function MovieCard({ movie, isFavMovieCard, removeMovie }) {
  // Bootstrap utility class h-100 sets moviecards to 100% -- same size
  // Typically, tepmplate literal ${movie._id} would be enough, but encodeURIComponent makes non-alphanumeric characters URL-compatible
  return (
    <Link
      to={`/movies/${encodeURIComponent(movie._id)}`}
      className="card-link-unstyled"
    >
      <Card className="card h-100 movie-card">
        {movie.Featured ? (
          <Card.Header className="card-header">Featured</Card.Header>
        ) : (
          false
        )}
        <Card.Img src={movie.ImagePath} alt={movie.Title} />
        <Card.Body>
          <Card.Title className="fs-6 fw-bolder">{movie.Title}</Card.Title>
          <Card.Text>by {movie.Director.Name}</Card.Text>
          {isFavMovieCard ? (
            <div className="align-right">
              <Button
                className="btn-secondary"
                onClick={function (event) {
                  event.preventDefault();
                  removeMovie(movie._id);
                }}
                size="sm"
                variant="secondary"
              >
                Remove
              </Button>
            </div>
          ) : (
            false
          )}
        </Card.Body>
      </Card>
    </Link>
  );
}

export { MovieCard };

MovieCard.propTypes = {
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
  isFavMovieCard: PropTypes.bool,
  removeMovie: PropTypes.func,
};
