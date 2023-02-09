import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';

// Function returns visual representation of component
function MainView() {
  // Empty arry is initial value of movies (state variable); usetMovies is a method to update movies variable seState() returns array of paired values that are desrtructured
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
            ID: movie._id,
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
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={function () {
          setSelectedMovie(null);
        }}
      ></MovieView>
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
            key={movie.ID}
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
