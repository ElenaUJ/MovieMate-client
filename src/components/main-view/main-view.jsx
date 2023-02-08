import { useState } from 'react';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { MovieView } from '../movie-view/movie-view.jsx';

// Function returns visual representation of component
function MainView() {
  // Empty arry is initial value of movies (state variable); usetMovies is a method to update movies variable seState() returns array of paired values that are desrtructured
  const [movies, setMovies] = useState([
    {
      _id: 1,
      Title: 'Ice Age',
      Description:
        'Ice Age is a movie about a group of animals trying to return a human baby to its tribe during the ice age.',
      Genre: 'Animation',
      Director: 'Chris Wedge',
      ImagePath:
        'https://m.media-amazon.com/images/M/MV5BOGEwMTQyMDktMWUwZC00MzExLTg1MGMtYWJiNWNhMzIyMGU5XkEyXkFqcGdeQXVyOTYyMTY2NzQ@._V1_.jpg',
      Featured: false,
    },
    {
      _id: 2,
      Title: 'The Truman Show',
      Description:
        'The Truman Show is a movie about a man who discovers his entire life is actually a reality TV show broadcast to the world and must decide whether to continue living in the fabricated world or leave it to discover the truth of his existence.',
      Genre: 'Drama',
      Director: 'Peter Weir',
      ImagePath:
        'https://m.media-amazon.com/images/M/MV5BMDIzODcyY2EtMmY2MC00ZWVlLTgwMzAtMjQwOWUyNmJjNTYyXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg',
      Featured: false,
    },
    {
      _id: 3,
      Title: 'Dead Poets Society',
      Description:
        'Dead Poets Society is a movie about an English teacher at a conservative, all-boys school in the 1950s who inspires his students through his teachings of poetry and self-expression.',
      Genre: 'Drama',
      Director: 'Peter Weir',
      ImagePath:
        'https://m.media-amazon.com/images/M/MV5BOGYwYWNjMzgtNGU4ZC00NWQ2LWEwZjUtMzE1Zjc3NjY3YTU1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
      Featured: false,
    },
  ]);

  // Default: no movie is selected
  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={function () {
          setSelectedMovie(null);
        }}
      ></MovieView>
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    // Root element (only one per component)
    // map() method maps each element in movies array to piece of UI
    // Key attribute (unique id) to avoid errors when list of elements of same type
    // movie object from each iteration of map() function is passed to <MovieCard> as a prop
    // onMovieClick is a function executing setSelectedMovie, which be passed to MovieCard component within callback of onClick event listener
    // onClick cannot be added dirctly to the component because it will be understood as prop
    <div>
      {movies.map(function (movie) {
        return (
          <MovieCard
            key={movie._id}
            movie={movie}
            onMovieClick={function (newSelectedMovie) {
              setSelectedMovie(newSelectedMovie);
            }}
          ></MovieCard>
        );
      })}
    </div>
  );
}

// Exposure of MainView component
export { MainView };
