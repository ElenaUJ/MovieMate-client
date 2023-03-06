import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { LoginView } from '../login-view/login-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';
import { NavigationBar } from '../navigation-bar/navigation-bar.jsx';
import { ProfileView } from '../profile-view/profile-view.jsx';
import { SignupView } from '../signup-view/signup-view.jsx';

function MainView() {
  // Checks for stored user and token first
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const showSpinner = function () {
    return (
      <Col className="spinner-wrapper">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  };

  // Logic to manage TopMovies list (needed in ProfileView and MovieCard)
  const addMovie = function (movieId) {
    fetch(
      `https://myflix-movie-app-elenauj.onrender.com/users/${user.Username}/topMovies/${movieId}`,
      {
        method: 'POST',
        headers: {
          // Question: Do I need Content-Type here at all? (See below for the DELETE request, too)
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
          return response.json();
        }
      })
      .then(function (updatedUser) {
        setUser(updatedUser);
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  const removeMovie = function (movieId) {
    fetch(
      `https://myflix-movie-app-elenauj.onrender.com/users/${user.Username}/topMovies/${movieId}`,
      {
        method: 'DELETE',
        headers: {
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
          return response.json();
        }
      })
      .then(function (updatedUser) {
        setUser(updatedUser);
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  // Checking if movie is already in user's top movies and setting Liked state
  const handleToggle = function (isLiked, movieId) {
    if (!isLiked) {
      addMovie(movieId);
      console.log('Liked button was clicked movie liked.');
    } else if (isLiked) {
      removeMovie(movieId);
      console.log('Liked button was clicked movie unliked.');
    }
  };

  const onLoggedOut = function () {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // Return the list of all movies. Hook for async tasks, runs callback whenever dependencies change
  useEffect(
    function () {
      if (!token) {
        return;
      }
      setLoading(true);
      fetch('https://myflix-movie-app-elenauj.onrender.com/movies', {
        // ${} is template literal, will extract value of token and convert it to string, Bearer keyword specified type of authorization being sent
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          setLoading(false);
          if (response.status === 401) {
            throw new Error('Unauthorized.');
          }
          return response.json();
        })
        .then(function (movies) {
          // sort methods compares every object with each other - if they have the same value for featured, they will be compared by title.
          let sortedMovies = movies.sort(function (a, b) {
            if (a.Featured === b.Featured) {
              return a.Title.localeCompare(b.Title);
            }
            // If they do not have the same Featured value, the featured movie gets a smaller values than the unfeatured one and comes first
            if (a.Featured) {
              return -1;
            } else {
              return 1;
            }
          });
          setMovies(sortedMovies);
        })
        .catch(function (error) {
          setLoading(false);
          console.error(error);
          if (error.message === 'Unauthorized.') {
            setErrorMessage('Error: Unauthorized. Please log in again.');
            onLoggedOut();
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
      <NavigationBar onLoggedOut={onLoggedOut} user={user} />
      <Container>
        <Row className="justify-content-md-center mt-5">
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
                    <>{showSpinner()}</>
                  ) : (
                    <MovieView
                      handleToggle={handleToggle}
                      movies={movies}
                      topmovies={user.TopMovies}
                    />
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
                  ) : loading ? (
                    <>{showSpinner()}</>
                  ) : (
                    <>
                      {movies.map(function (movie) {
                        return (
                          <Col
                            className="mb-4"
                            key={movie._id}
                            xs={6}
                            md={4}
                            lg={3}
                            xl={2}
                          >
                            <MovieCard movie={movie} />
                          </Col>
                        );
                      })}
                    </>
                  )}
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <Col>
                      <ProfileView
                        movies={movies}
                        onLoggedOut={onLoggedOut}
                        removeMovie={removeMovie}
                        setUser={setUser}
                        token={token}
                        user={user}
                      />
                    </Col>
                  )}
                </>
              }
            />
          </Routes>
        </Row>
      </Container>
    </BrowserRouter>
  );
}

// Exposure of MainView component
export { MainView };
