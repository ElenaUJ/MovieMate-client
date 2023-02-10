import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';

// Function returns visual representation of component
function MainView() {
  // Empty array is initial value of movies (state variable); usetMovies is a method to update movies variable setState() returns array of paired values that are desrtructured
  const [movies, setMovies] = useState([]);

  // Default: no movie is selected
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Hook for async tasks, runs callback whenever dependencies change
  useEffect(function () {
    fetch('https://myflix-movie-app-elenauj.onrender.com/movies')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const moviesFromApi = data.map(function (movie) {
          return {
            Id: movie._id,
            Title: movie.Title,
            Description: movie.Description,
            Genre: {
              Name: movie.Genre.Name,
              Description: movie.Genre.Description,
            },
            Director: {
              Name: movie.Director.Name,
              Bio: movie.Director.Bio,
              Birth: movie.Director.Birth,
              Death: movie.Director.Death,
            },
            Image: movie.ImagePath,
            Featured: movie.Featured,
          };
        });

        setMovies(moviesFromApi);
      })
      .catch(function (error) {
        console.error(error);
        return <div>Error: Movies could not be fetched.</div>;
      });
    // Empty dependency array [] tells React that there are no dependencies, so this cb fn doesn't have to be rerun
  }, []);

  if (selectedMovie) {
    const similarMovies = movies
      .filter(function (movie) {
        return movie.Genre.Name === selectedMovie.Genre.Name;
      })
      // Excluding selectedMovie from the list
      .filter(function (movie) {
        return movie.Title !== selectedMovie.Title;
      });

    return (
      // Question: Could I not have added the similar movies in the MovieView component? What if I want to display the list above the image?
      <div>
        <MovieView
          movie={selectedMovie}
          onBackClick={function () {
            setSelectedMovie(null);
          }}
        ></MovieView>
        <hr />
        <h2>Similar movies:</h2>
        <div>
          {similarMovies.map(function (movie) {
            return (
              <MovieCard
                key={movie.Id}
                movie={movie}
                onMovieClick={function (newSelectedMovie) {
                  setSelectedMovie(newSelectedMovie);
                }}
              ></MovieCard>
            );
          })}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return <div>Fetching movies...</div>;
  }

  return (
    // Root element (only one per component)
    // map() method maps each element in movies array to piece of UI
    // Key attribute (unique id) to avoid errors when list of elements of same type
    // movie object from each iteration of map() function is passed to <MovieCard> as a prop
    // onMovieClick is a function executing setSelectedMovie, which be passed to MovieCard component within callback of onClick event listener
    // onClick cannot be added dirctly to the component because it will be understood as prop
    <div>
      {movies.map(function (movie) {
        return (
          <MovieCard
            key={movie.Id}
            movie={movie}
            onMovieClick={function (newSelectedMovie) {
              setSelectedMovie(newSelectedMovie);
            }}
          ></MovieCard>
        );
      })}
    </div>
  );
}

// Exposure of MainView component
export { MainView };

const moviePropTypes = PropTypes.shape({
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
});

// Question: I don't understand how to identify props in the MainView component... Do I have to do this here at all? When I add .isRequired to the propTypes here, it comes up with an error message in the console, that the props are undefinded. Which makes me think that I might not need any propTypes here at all?
// Other Question: I tried to export the moviePropTypes variable into the other components to use in there, but it didn't let me, I got this error: ReferenceError: Cannot access 'moviePropTypes' before initialization...is there an easy way to solve this?
MainView.propTypes = {
  movies: PropTypes.arrayOf(moviePropTypes),
  selectedMovie: moviePropTypes,
  setSelectedMovie: PropTypes.func,
};
