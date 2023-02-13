import { useState, useEffect } from 'react';
import { LoginView } from '../login-view/login-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';

// Function returns visual representation of component
function MainView() {
  // Empty array is initial value of movies (state variable); setMovies is a method to update movies variable, useState() returns array of paired values that are destructured
  const [movies, setMovies] = useState([]);

  const [user, setUser] = useState(null);

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
        // This has to be fixed, as the message wouldn't be rendered. I have to store the message in a state variable somehow
        return <div>Error: Movies could not be fetched.</div>;
      });
    // Empty dependency array [] tells React that there are no dependencies, so this cb fn doesn't have to be rerun
  }, []);

  if (!user) {
    return <LoginView onLoggedIn={setUser}></LoginView>;
  }

  if (selectedMovie) {
    const similarMovies = movies.filter(function (movie) {
      return (
        movie.Genre.Name === selectedMovie.Genre.Name &&
        movie.Title !== selectedMovie.Title
      );
    });

    // Checking if there are similar movies at all
    if (similarMovies.length === 0) {
      printSimilarMovies = 'No similar movies in database.';
    } else {
      printSimilarMovies = similarMovies.map(function (movie) {
        return (
          <MovieCard
            key={movie.Id}
            movie={movie}
            onMovieClick={setSelectedMovie}
          ></MovieCard>
        );
      });
    }

    return (
      <div>
        <MovieView
          movie={selectedMovie}
          onBackClick={function () {
            setSelectedMovie(null);
          }}
        ></MovieView>
        <hr />
        <h2>Similar movies:</h2>
        {printSimilarMovies}
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
            onMovieClick={setSelectedMovie}
          ></MovieCard>
        );
      })}
    </div>
  );
}

// Exposure of MainView component
export { MainView };
