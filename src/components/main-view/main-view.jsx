import { useState, useEffect } from 'react';
import { LoginView } from '../login-view/login-view.jsx';
import { SignupView } from '../signup-view/signup-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// Function returns visual representation of component
function MainView() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  // if-else statement can not be used in useState hook (only expressions are allowerd, not statements) However, a ternary operator `condition ? expressioIfTrue : expressionIfFalse` is allowed!
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  // Empty array is initial value of movies (state variable); setMovies is a method to update movies variable, useState() returns array of paired values that are destructured
  const [movies, setMovies] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);

  // Hook for async tasks, runs callback whenever dependencies change
  useEffect(
    function () {
      // Question: Do I need this at all?
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

  return (
    // replace keyword when navigating to login page means the current URL is replaced in the history stack, so the user can't go back hitting the back button
    // Route to path="/movies/:movieId" contains URL param, allowing Routes to match dynamic URLs
    <BrowserRouter>
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={6}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={6}>
                    <LoginView
                      onLoggedIn={function (user, token) {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : errorMessage ? (
                  <Col md={3}>{errorMessage}</Col>
                ) : movies.length === 0 ? (
                  <Col md={3}>Fetching movies...</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : errorMessage ? (
                  <Col md={3}>{errorMessage}</Col>
                ) : movies.length === 0 ? (
                  <Col md={3}>Fetching movies...</Col>
                ) : (
                  <>
                    {movies.map(function (movie) {
                      return (
                        <Col
                          className="mb-4"
                          key={movie._id}
                          md={3}
                          sm={4}
                          xs={6}
                        >
                          <MovieCard movie={movie} />
                        </Col>
                      );
                    })}
                  </>
                )}
                <Link to={`/login`}>
                  <div className="align-right">
                    <button
                      onClick={function () {
                        setUser(null);
                        setToken(null);
                        localStorage.clear();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </Link>
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
}

// Exposure of MainView component
export { MainView };

// Old code (selectedMovie)

// if (selectedMovie) {
//   let similarMovies = movies.filter(function (movie) {
//     return (
//       movie.Genre.Name === selectedMovie.Genre.Name &&
//       movie.Title !== selectedMovie.Title
//     );
//   });

//   let printSimilarMovies;
//   // Checking if there are similar movies at all
//   if (similarMovies.length === 0) {
//     printSimilarMovies = 'No similar movies in database.';
//   } else {
//     printSimilarMovies = similarMovies.map(function (movie) {
//       // Bootstrap utility class mb stands for margin bottom and the number for the sixe (0-5)
//       return (
//         <Col key={movie._id} md={3} sm={4} xs={6}>
//           <MovieCard
//             movie={movie}
//             onMovieClick={setSelectedMovie}
//           ></MovieCard>
//         </Col>
//       );
//     });
//   }

//   return (
//     <>
//       <Row className="justify-content-md-center">
//         <Col md={8}>
//           <MovieView
//             movie={selectedMovie}
//             onBackClick={function () {
//               setSelectedMovie(null);
//             }}
//           ></MovieView>
//           <hr />
//         </Col>
//       </Row>
//       <Row className="justify-content-md-center">
//         <h2>Similar movies:</h2>
//         {printSimilarMovies}
//       </Row>
//     </>
//   );
// }
