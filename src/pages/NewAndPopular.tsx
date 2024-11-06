import React, { useEffect, useState } from 'react';
import { Calendar, TrendingUp, Star, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Movie, MovieDetails, tmdb } from '../services/tmdb';
import MovieModal from '../components/MovieModal';
import { useNavigate } from 'react-router-dom';

interface ContentSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function NewAndPopular() {
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<MovieDetails | null>(null);
  const [activeSection, setActiveSection] = useState('trending');
  const [content, setContent] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sections: ContentSection[] = [
    { id: 'trending', title: 'Di Tendenza Oggi', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'upcoming', title: 'In Arrivo', icon: <Calendar className="w-5 h-5" /> },
    { id: 'toprated', title: 'I Più Votati', icon: <Star className="w-5 h-5" /> },
    { id: 'popular', title: 'Popolari', icon: <Clock className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        let data: Movie[] = [];
        switch (activeSection) {
          case 'trending':
            data = await tmdb.getTrending();
            break;
          case 'upcoming':
            data = await tmdb.getUpcoming();
            break;
          case 'toprated':
            data = await tmdb.getTopRated();
            break;
          case 'popular':
            data = await tmdb.getPopular();
            break;
        }
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [activeSection]);

  const handleContentClick = async (movieId: number) => {
    try {
      const details = await tmdb.getMovieDetails(movieId);
      setSelectedContent(details);
    } catch (error) {
      console.error('Error fetching content details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Nuovi e Popolari</h1>

        <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {section.icon}
              <span>{section.title}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Caricamento...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.map((item) => (
              <div
                key={item.id}
                className="flex bg-zinc-900 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleContentClick(item.id)}
                onDoubleClick={() => navigate(`/watch/${item.id}`)}
              >
                <img
                  src={tmdb.getImageUrl(item.backdrop_path, 'w500')}
                  alt={item.title}
                  className="w-48 h-full object-cover"
                />
                <div className="flex-1 p-4">
                  <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-green-500 font-semibold">
                      {Math.round(item.vote_average * 10)}% Match
                    </span>
                    <span className="text-gray-400">
                      {new Date(item.release_date).getFullYear()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">{item.overview}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedContent && (
        <MovieModal
          movie={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlay={() => navigate(`/watch/${selectedContent.id}`)}
        />
      )}
    </div>
  );
}