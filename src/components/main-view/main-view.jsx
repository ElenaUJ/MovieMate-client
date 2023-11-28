import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginView } from '../login-view/login-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';
import { NavigationBar } from '../navigation-bar/navigation-bar.jsx';
import { ProfileView } from '../profile-view/profile-view.jsx';
import { SearchBar } from './search-bar.jsx';
import { SignupView } from '../signup-view/signup-view.jsx';

function MainView() {
  // Checks for stored user and token first
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [userQuery, setUserQuery] = useState('');

  const showSpinner = function () {
    return (
      <Col className="spinner-wrapper">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  };

  // Logic to render filteredMovies list

  const onSearch = function (searchInput) {
    setUserQuery(searchInput);
  };

  useEffect(
    function () {
      if (!userQuery) {
        setFilteredMovies([]);
      } else {
        let searchResult = movies.filter(function (movie) {
          const movieLowerCase = movie.Title.toLowerCase();
          const directorLowerCase = movie.Director.Name.toLowerCase();
          const genreLowerCase = movie.Genre.Name.toLowerCase();
          const userQueryLowerCase = userQuery.toLowerCase();

          return (
            movieLowerCase.includes(userQueryLowerCase) ||
            directorLowerCase.includes(userQueryLowerCase) ||
            genreLowerCase.includes(userQueryLowerCase)
          );
        });
        setFilteredMovies(searchResult);
      }
    },
    [movies, userQuery]
  );

  // Logic to manage TopMovies list (needed in both ProfileView and MovieCard)
  const addMovie = function (movieId) {
    fetch(`localhost:8080/users/${user.Username}/topMovies/${movieId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 401) {
          throw new Error(
            "Sorry, you're not authorized to access this resource. "
          );
        } else if (response.status === 409) {
          throw new Error('You already added this movie to the list.');
        } else if (response.ok) {
          return response.json();
        }
      })
      .then(function (updatedUser) {
        toast.success('Movie has been added to your Top Movies.');
        setUser(updatedUser);
      })
      .catch(function (error) {
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to add movie. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };

  const removeMovie = function (movieId) {
    fetch(`localhost:8080/users/${user.Username}/topMovies/${movieId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 401) {
          throw new Error(
            "Sorry, you're not authorized to access this resource. "
          );
        } else if (response.ok) {
          return response.json();
        }
      })
      .then(function (updatedUser) {
        toast.success('Movie has been removed from your Top Movies.');
        setUser(updatedUser);
      })
      .catch(function (error) {
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to delete. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };

  // To be run whenever user logs out (or is logged out)
  const onLoggedOut = function () {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // Return the list of all movies on the main page. Hook for async tasks, runs callback whenever dependencies (token in this case) change
  useEffect(
    function () {
      if (!token) {
        return;
      }
      setLoading(true);

      fetch('localhost:8080/movies', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          setLoading(false);
          if (response.status === 401) {
            throw new Error(
              "Sorry, you're not authorized to access this resource. "
            );
          } else if (response.ok) {
            return response.json();
          }
        })
        .then(function (movies) {
          // Sort movies in alphabetical order, and featured movies first
          // Sort method compares every object with each other - if they have the same value for featured, they will be compared by title.
          let sortedMovies = movies.sort(function (a, b) {
            if (a.Featured === b.Featured) {
              return a.Title.localeCompare(b.Title);
            }
            // If they do not have the same Featured value, the featured movie gets a smaller value than the unfeatured one and comes first
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
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error(
              'An error occurred while trying to delete. Please try again later.'
            );
          }
          console.error('An error occurred:' + error);
        });
    },
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
              path="/"
              element={
                <>
                  <SearchBar onSearch={onSearch} />
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : loading ? (
                    <>{showSpinner()}</>
                  ) : userQuery && filteredMovies.length === 0 ? (
                    <Col className="mt-5">
                      Sorry, we couldn't find any movies that match your search.
                      Please try again with a different search term.
                    </Col>
                  ) : userQuery ? (
                    <>
                      {filteredMovies.map(function (movie) {
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
              path="/movies/:movieId"
              element={
                <>
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : movies.length === 0 ? (
                    <>{showSpinner()}</>
                  ) : (
                    <MovieView
                      addMovie={addMovie}
                      movies={movies}
                      removeMovie={removeMovie}
                      topmovies={user.TopMovies}
                    />
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

export { MainView };
