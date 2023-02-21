import { useState, useEffect } from 'react';
import { LoginView } from '../login-view/login-view.jsx';
import { SignupView } from '../signup-view/signup-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

  const [errorMessage, setErrorMessage] = useState(null);

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
          if (response.status === 401) {
            throw new Error('Unauthorized.');
          }
          return response.json();
        })
        .then(function (movies) {
          setMovies(movies);
        })
        .catch(function (error) {
          console.error(error);
          if (error.message === 'Unauthorized.') {
            setErrorMessage('Error: Unauthorized. Please log in again.');
            setUser(null);
            setToken(null);
            localStorage.clear();
          } else {
            setErrorMessage('Error: Movies could not be fetched.');
          }
        });
    },
    // Dependency array [] contains token which tells React that it needs to call fetch every time token is changed
    [token]
  );

  // Question: I did not manage to transfer this code block into the return block. I couldn't figure out how to declare my variables and use the `similarMovies.length === 0` conditional inside the JSX expression. That's why I left it out... is that ok? Or too confusing/not good practice? Is there a way to do it?
  if (selectedMovie) {
    let similarMovies = movies.filter(function (movie) {
      return (
        movie.Genre.Name === selectedMovie.Genre.Name &&
        movie.Title !== selectedMovie.Title
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
          <Col key={movie._id} md={3} sm={4} xs={6}>
            <MovieCard
              movie={movie}
              onMovieClick={setSelectedMovie}
            ></MovieCard>
          </Col>
        );
      });
    }

    // Use of md breakpoint makes it so all devices with a screen smaller than md will use entire width of the screen
    return (
      <>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <MovieView
              movie={selectedMovie}
              onBackClick={function () {
                setSelectedMovie(null);
              }}
            ></MovieView>
            <hr />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <h2>Similar movies:</h2>
          {printSimilarMovies}
        </Row>
      </>
    );
  }

  return (
    // Root element (only one per component)
    // map() method maps each element in movies array to piece of UI
    // Key attribute (unique id) to avoid errors when list of elements of same type
    // movie object from each iteration of map() function is passed to <MovieCard> as a prop
    // onMovieClick is a function executing setSelectedMovie, which be passed to MovieCard component within callback of onClick event listener
    // onClick cannot be added dirctly to the component because it will be understood as prop
    <Row className="justify-content-md-center">
      {!user ? (
        <Col md={4}>
          <LoginView
            onLoggedIn={function (user, token) {
              setUser(user);
              setToken(token);
            }}
          ></LoginView>
          <h2 className="mb-3">Or sign up here</h2>
          <SignupView></SignupView>
        </Col>
      ) : movies.length === 0 ? (
        <Col md={3}>
          <p>Fetching movies...</p>
        </Col>
      ) : errorMessage ? (
        <Col md={3}>
          <p>{errorMessage}</p>
        </Col>
      ) : (
        <>
          {movies.map(function (movie) {
            return (
              <Col className="mb-4" key={movie._id} md={3} sm={4} xs={6}>
                <MovieCard
                  movie={movie}
                  onMovieClick={setSelectedMovie}
                ></MovieCard>
              </Col>
            );
          })}
          <div className="align-right">
            <Button
              variant="primary"
              onClick={function () {
                setUser(null);
                setToken(null);
                localStorage.clear();
              }}
            >
              Logout
            </Button>
          </div>
        </>
      )}
    </Row>
  );
}

// Exposure of MainView component
export { MainView };
