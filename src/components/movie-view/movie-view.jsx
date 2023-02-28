import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import ToggleButton from 'react-bootstrap/ToggleButton';

// The entire movies array has to be passed into the MovieView prop because React Router only allows access to
function MovieView({ movies, user, token, setUser }) {
  // Accesses movieId URL param that has been defined in the movie-card component
  const { movieId } = useParams();
  const movie = movies.find(function (m) {
    return m._id === movieId;
  });

  // Checking if movie is already in user's top movies and setting Liked state
  const isLiked = user.TopMovies.includes(movieId);
  const [liked, setLiked] = useState(isLiked);

  const handleFavourites = function () {
    if (!liked) {
      fetch(
        `https://myflix-movie-app-elenauj.onrender.com/users/${user.Username}/topMovies/${movieId}`,
        {
          method: 'POST',
          headers: {
            // Question: Do I need this here? Is it just for the request?
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(function (response) {
          if (response.status === 401) {
            console.log('Unauthorized');
            alert('Unauthorized.');
            throw new Error('Unauthorized.');
          } else if (response.ok) {
            console.log('Movie was liked in database');
            setLiked(true);
            return response.json();
          }
        })
        .then(function (updatedUser) {
          setUser(updatedUser);
          console.log('Liked was handled.');
        })
        .catch(function (error) {
          console.error(error);
          alert('Error: Something went wrong.');
        });
    } else if (liked) {
      fetch(
        `https://myflix-movie-app-elenauj.onrender.com/users/${user.Username}/topMovies/${movieId}`,
        {
          method: 'DELETE',
          headers: {
            // Question: Do I need this here? Is it just for the request?
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(function (response) {
          if (response.status === 401) {
            console.log('Unauthorized');
            alert('Unauthorized.');
            throw new Error('Unauthorized.');
          } else if (response.ok) {
            console.log('Movie was unliked in database');
            setLiked(false);
            return response.json();
          }
        })
        .then(function (updatedUser) {
          setUser(updatedUser);
          console.log('Unliked was handled.');
        })
        .catch(function (error) {
          console.error(error);
          alert('Error: Something went wrong.');
        });
    }
  };

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
          // what does this do?
          setLiked(event.currentTarget.checked);
          console.log('Liked button was clicked and set to: ' + { liked });
          handleFavourites();
        }}
      >
        Like it
      </ToggleButton>
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
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    TopMovies: PropTypes.array,
  }).isRequired,
  token: PropTypes.string.isRequired,
  setUser: PropTypes.func.inRequired,
};
