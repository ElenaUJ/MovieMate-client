import { useState } from 'react';

function SignupView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = function (event) {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch('https://myflix-movie-app-elenauj.onrender.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.ok) {
          console.log(response.json());
          alert('Successfully registered!');
          window.location.reload();
        } else {
          console.log('Registration failed.');
          alert('Registration failed.');
        }
      })
      .catch(function (error) {
        console.error(error);
        alert('Error: Something went wrong.');
      });
  };

  return (
    // !!!!!!Include logic to match passwords
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
          pattern="[a-zA-Z0-9]+"
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
      <label>
        Retype password:
        <input type="password" required />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={function (event) {
            setEmail(event.target.value);
          }}
          required
        />
      </label>
      <label>
        Birthday
        <input
          type="date"
          value={birthday}
          onChange={function (event) {
            setBirthday(event.target.value);
          }}
          required
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export { SignupView };
