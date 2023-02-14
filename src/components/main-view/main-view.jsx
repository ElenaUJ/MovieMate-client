import { useState, useEffect } from 'react';
import { LoginView } from '../login-view/login-view.jsx';
import { SignupView } from '../signup-view/signup-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';

// Function returns visual representation of component
function MainView() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  // if-else statement can not be used in useState hook (only expressions are allowerd, not statements) However, a ternary operator `condition ? expressioIfTrue : expressionIfFalse` is allowed!
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  // Empty array is initial value of movies (state variable); setMovies is a method to update movies variable, useState() returns array of paired values that are destructured
  const [movies, setMovies] = useState([]);

  // Default: no movie is selected
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Hook for async tasks, runs callback whenever dependencies change
  useEffect(
    function () {
      if (!token) {
        return;
      }

      fetch('https://myflix-movie-app-elenauj.onrender.com/movies', {
        // ${} is template literal, will extract value of token and convert it to string, Bearer keyword specified type of authorization being sent
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (movies) {
          setMovies(movies);
        })
        .catch(function (error) {
          console.error(error);
          // This has to be fixed, as the message wouldn't be rendered. I have to store the message in a state variable somehow
          return <div>Error: Movies could not be fetched.</div>;
        });
    },
    // Dependency array [] contains token which tells React that it needs to call fetch every time token is changed
    [token]
  );

  if (!user) {
    return (
      <>
        <LoginView
          onLoggedIn={function (user, token) {
            setUser(user);
            setToken(token);
          }}
        ></LoginView>
        Or sign up here
        <SignupView></SignupView>
      </>
    );
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
            key={movie._id}
            movie={movie}
            onMovieClick={setSelectedMovie}
          ></MovieCard>
        );
      });
    }

    return (
      <>
        <MovieView
          movie={selectedMovie}
          onBackClick={function () {
            setSelectedMovie(null);
          }}
        ></MovieView>
        <hr />
        <h2>Similar movies:</h2>
        {printSimilarMovies}
      </>
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
    <>
      <div>
        {movies.map(function (movie) {
          return (
            <MovieCard
              key={movie._id}
              movie={movie}
              onMovieClick={setSelectedMovie}
            ></MovieCard>
          );
        })}
      </div>
      <button
        onClick={function () {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      >
        Logout
      </button>
    </>
  );
}

// Exposure of MainView component
export { MainView };
