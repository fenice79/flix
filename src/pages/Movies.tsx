import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Movie, tmdb } from '../services/tmdb';
import MovieModal from '../components/MovieModal';
import { useNavigate } from 'react-router-dom';

interface MovieCategory {
  id: string;
  title: string;
  fetchFunction: () => Promise<Movie[]>;
}

export default function Movies() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [categories, setCategories] = useState<{ [key: string]: Movie[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  const movieCategories: MovieCategory[] = [
    { id: 'trending', title: 'Di Tendenza', fetchFunction: tmdb.getTrending },
    { id: 'popular', title: 'Popolari', fetchFunction: tmdb.getPopular },
    { id: 'topRated', title: 'I Più Votati', fetchFunction: tmdb.getTopRated },
    { id: 'upcoming', title: 'In Arrivo', fetchFunction: tmdb.getUpcoming }
  ];

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const results = await Promise.all(
          movieCategories.map(async (category) => {
            const movies = await category.fetchFunction();
            return { id: category.id, movies };
          })
        );

        const newCategories = results.reduce((acc, { id, movies }) => {
          acc[id] = movies;
          return acc;
        }, {} as { [key: string]: Movie[] });

        setCategories(newCategories);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  const handleMovieClick = async (movieId: number) => {
    try {
      const details = await tmdb.getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Film</h1>

        {movieCategories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">{category.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories[category.id]?.map((movie) => (
                <div
                  key={movie.id}
                  className="relative group cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => handleMovieClick(movie.id)}
                  onDoubleClick={() => navigate(`/watch/${movie.id}`)}
                >
                  <img
                    src={tmdb.getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <h3 className="text-white text-center font-bold px-4">{movie.title}</h3>
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-yellow-400 mr-2">★</span>
                        <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={() => navigate(`/watch/${selectedMovie.id}`)}
        />
      )}
    </div>
  );
}