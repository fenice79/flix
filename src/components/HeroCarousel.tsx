import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, tmdb } from '../services/tmdb';
import MovieModal from './MovieModal';
import { useNavigate } from 'react-router-dom';

export default function HeroCarousel() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const trendingMovies = await tmdb.getTrending();
        if (trendingMovies.length > 0) {
          setMovies(trendingMovies.slice(0, 5));
        }
      } catch (error) {
        console.error('Error in HeroCarousel:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleMoreInfo = async (movieId: number) => {
    try {
      const details = await tmdb.getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  if (isLoading) {
    return <div className="h-[95vh] bg-black"></div>;
  }

  if (movies.length === 0) {
    return (
      <div className="h-[95vh] bg-black flex items-center justify-center">
        <p className="text-white text-xl">Nessun film disponibile</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[95vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="flex h-full" style={{ width: `${movies.length * 100}%` }}>
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="relative w-full h-full"
                style={{ width: `${100 / movies.length}%` }}
              >
                <img
                  src={tmdb.getImageUrl(movie.backdrop_path, 'original')}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute bottom-[20%] left-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  <h1 className="text-6xl font-bold text-white max-w-2xl mb-4">{movie.title}</h1>
                  <p className="text-xl text-gray-300 max-w-xl mb-8">{movie.overview}</p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => navigate(`/watch/${movie.id}`)}
                      className="flex items-center px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition font-semibold"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Play
                    </button>
                    <button 
                      onClick={() => handleMoreInfo(movie.id)}
                      className="flex items-center px-8 py-3 bg-gray-600/70 text-white rounded hover:bg-gray-600 transition font-semibold"
                    >
                      <Info className="h-6 w-6 mr-2" />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {movies.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
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