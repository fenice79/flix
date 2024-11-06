import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie, MovieDetails, tmdb } from '../services/tmdb';
import MovieModal from './MovieModal';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);

  const handleMovieClick = async (movieId: number) => {
    try {
      const details = await tmdb.getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex-none w-64 transition-transform hover:scale-105 cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
                onDoubleClick={() => navigate(`/watch/${movie.id}`)}
              >
                <img
                  src={tmdb.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="rounded-md w-full h-96 object-cover"
                />
                <div className="mt-2">
                  <h3 className="text-sm text-white font-medium">{movie.title}</h3>
                  <p className="text-xs text-gray-400">{new Date(movie.release_date).getFullYear()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          onPlay={() => navigate(`/watch/${selectedMovie.id}`)}
        />
      )}
    </>
  );
}