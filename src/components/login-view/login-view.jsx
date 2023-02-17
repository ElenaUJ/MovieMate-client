import { useState } from 'react';
import { PropTypes } from 'prop-types';

function LoginView({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = function (event) {
    // Preventing default behaviour which would be to reload entire page
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch('https://myflix-movie-app-elenauj.onrender.com/login', {
      method: 'POST',
      // Specifies content being sent in request body so server can deal with it better
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      // Extracts JWT from response content in JSON format
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('Login response: ', data);

        if (data.user) {
          // After successful login, user object and token will be stored using localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          // User and token are defined in the API's auth.js file!
          onLoggedIn(data.user, data.token);
        } else {
          alert('No such user');
        }
      })
      .catch(function (error) {
        alert('Error: Something went wrong.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={function (event) {
            setUsername(event.target.value);
          }}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={function (event) {
            setPassword(event.target.value);
          }}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export { LoginView };

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};
