import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { tmdb } from '../services/tmdb';

export default function WatchTV() {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${tmdb.apiKey}&language=it-IT`
        );
        const data = await response.json();
        setShowDetails(data);
      } catch (error) {
        console.error('Error fetching show details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchShowDetails();
    }
  }, [id]);

  if (isLoading || !showDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="relative pt-16">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${showDetails.backdrop_path}`}
            alt={showDetails.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-32 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={`https://image.tmdb.org/t/p/w500${showDetails.poster_path}`}
              alt={showDetails.name}
              className="w-64 rounded-lg shadow-xl"
            />
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{showDetails.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-yellow-400">★ {showDetails.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">{showDetails.first_air_date}</span>
                <span className="text-gray-400">{showDetails.number_of_seasons} stagioni</span>
              </div>
              
              <p className="text-lg text-gray-300 mb-6">{showDetails.overview}</p>
              
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Riproduci
                </button>
                <button className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Trailer
                </button>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-2">Generi</h2>
                <div className="flex gap-2">
                  {showDetails.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}