function MovieView({ movie, onBackClick }) {
  return (
    <div>
      <h1>{movie.Title}</h1>
      <p>
        Director: {movie.Director}
        <br />
        Genre: {movie.Genre}
      </p>
      <p>Description: {movie.Description}</p>
      <img src={movie.Image} />
      <br />
      <button onClick={onBackClick}>Back</button>
    </div>
  );
}

export { MovieView };
