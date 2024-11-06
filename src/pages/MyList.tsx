import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Movie, MovieDetails, tmdb } from '../services/tmdb';
import MovieModal from '../components/MovieModal';

// In a real app, this would come from a backend/database
const DEMO_LIST_ITEMS = [
  551, // Blade Runner 2049
  27205, // Inception
  238, // Il Padrino
  155, // Il Cavaliere Oscuro
  680, // Pulp Fiction
  13, // Forrest Gump
  598, // Città di Dio
  389, // Matrix
  278, // Le Ali della Libertà
  244786, // Whiplash
];

export default function MyList() {
  const navigate = useNavigate();
  const [myList, setMyList] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const movies = await Promise.all(
          DEMO_LIST_ITEMS.map(async (id) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdb.apiKey}&language=it-IT`
            );
            return response.json();
          })
        );
        setMyList(movies);
      } catch (error) {
        console.error('Error fetching my list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyList();
  }, []);

  const handleMovieClick = async (movieId: number) => {
    try {
      const details = await tmdb.getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const removeFromList = (movieId: number) => {
    setMyList((current) => current.filter((movie) => movie.id !== movieId));
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">La Mia Lista</h1>
          <div className="text-gray-400">
            {myList.length} {myList.length === 1 ? 'titolo' : 'titoli'}
          </div>
        </div>

        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Plus className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-xl">La tua lista è vuota</p>
            <p className="text-gray-500 mt-2">
              Aggiungi film e serie TV cliccando sull'icona + nei contenuti
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {myList.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-zinc-900 rounded-lg overflow-hidden"
              >
                <img
                  src={tmdb.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover cursor-pointer"
                  onClick={() => handleMovieClick(movie.id)}
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                  <button
                    onClick={() => removeFromList(movie.id)}
                    className="self-end p-2 hover:bg-red-600/50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                  
                  <div>
                    <h3 className="text-white font-bold mb-2">{movie.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-green-500">
                        {Math.round(movie.vote_average * 10)}% Match
                      </span>
                      <span className="text-gray-300">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/watch/${movie.id}`)}
                        className="flex-1 bg-white text-black py-2 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => handleMovieClick(movie.id)}
                        className="flex-1 bg-gray-600/70 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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