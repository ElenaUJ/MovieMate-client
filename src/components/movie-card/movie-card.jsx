// props argument is destructured/ movie is the name of the prop
function MovieCard({ movie, onMovieClick }) {
  return (
    <div
      onClick={function () {
        onMovieClick(movie);
      }}
    >
      {movie.Title}
    </div>
  );
}

export { MovieCard };
