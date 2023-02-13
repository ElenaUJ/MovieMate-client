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
      body: JSON.stringify(data),
    })
      .then(function (response) {
        // .ok indicated whether HTTP status code indicates success
        if (response.ok) {
          onLoggedIn(username);
        } else {
          alert('Error: Wrong username or password');
        }
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Login failed.');
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
