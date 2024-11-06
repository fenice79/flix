import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import { tmdb } from '../services/tmdb';

// Sample video URL for testing
const SAMPLE_VIDEO_URL = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function Watch() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdb.apiKey}&language=it-IT`
        );
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (isLoading || !movieDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16">
        <div className="flex flex-col lg:flex-row">
          {/* Video Player Section */}
          <div className="lg:w-[70%] h-[calc(100vh-4rem)]">
            <VideoPlayer 
              src={SAMPLE_VIDEO_URL} 
              title={movieDetails.title}
            />
          </div>

          {/* Movie Details Section */}
          <div className="lg:w-[30%] p-6 h-[calc(100vh-4rem)] overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-4">{movieDetails.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-yellow-400">★ {movieDetails.vote_average.toFixed(1)}</span>
              <span className="text-gray-400">{movieDetails.runtime} min</span>
              <span className="text-gray-400">{new Date(movieDetails.release_date).getFullYear()}</span>
            </div>
            
            <p className="text-gray-300 mb-6">{movieDetails.overview}</p>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 font-semibold">Generi: </span>
                <span className="text-white">
                  {movieDetails.genres.map((genre: any) => genre.name).join(', ')}
                </span>
              </div>
              
              <div>
                <span className="text-gray-400 font-semibold">Lingue: </span>
                <span className="text-white">
                  {movieDetails.spoken_languages.map((lang: any) => lang.name).join(', ')}
                </span>
              </div>
              
              {movieDetails.production_companies.length > 0 && (
                <div>
                  <span className="text-gray-400 font-semibold">Produzione: </span>
                  <span className="text-white">
                    {movieDetails.production_companies.map((company: any) => company.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}