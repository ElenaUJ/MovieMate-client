import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { MovieCard } from '../movie-card/movie-card.jsx';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// The entire movies array has to be passed into the MovieView prop because React Router only allows access to
function MovieView({ movies, user, addMovie, removeMovie }) {
  // Accesses movieId URL param that has been defined in the movie-card component
  const { movieId } = useParams();
  const movie = movies.find(function (m) {
    return m._id === movieId;
  });

  // Checking if movie is already in user's top movies and setting Liked state
  const isLiked = user.TopMovies.includes(movieId);
  const handleToggle = function () {
    if (!isLiked) {
      addMovie(movieId);
      console.log('Liked button was clicked movie liked.');
    } else if (isLiked) {
      removeMovie(movieId);
      console.log('Liked button was clicked movie unliked.');
    }
  };

  let similarMovies = movies.filter(function (similarMovie) {
    return (
      similarMovie.Genre.Name === movie.Genre.Name &&
      similarMovie.Title !== movie.Title
    );
  });

  let printSimilarMovies;
  // Checking if there are similar movies at all
  if (similarMovies.length === 0) {
    printSimilarMovies = 'No similar movies in database.';
  } else {
    printSimilarMovies = similarMovies.map(function (movie) {
      // Bootstrap utility class mb stands for margin bottom and the number for the sixe (0-5)
      return (
        <Col key={movie._id} xl={2} lg={3} md={4} sm={6} xs={6}>
          <MovieCard movie={movie}></MovieCard>
        </Col>
      );
    });
  }

  return (
    <>
      <h1>{movie.Title}</h1>
      <p>
        Director: {movie.Director.Name}
        <br />
        Genre: {movie.Genre.Name}
      </p>
      <p>{movie.Description}</p>
      <img className="w-100 mb-4" src={movie.ImagePath} />
      <ToggleButton
        id="toggle-favourite"
        type="checkbox"
        variant="outline-secondary"
        checked={isLiked}
        value="1"
        onChange={function (event) {
          event.preventDefault();
          handleToggle();
        }}
      >
        Like it
      </ToggleButton>
      <Row>
        <h2>Similar movies:</h2>
        {printSimilarMovies}
      </Row>
      <Row className="mb-4">
        <div className="align-right">
          <Button
            as={Link}
            to={`/`}
            variant="secondary"
            className="btn-secondary"
          >
            Back
          </Button>
        </div>
      </Row>
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
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
  addMovie: PropTypes.func.isRequired,
  removeMovie: PropTypes.func.isRequired,
};
