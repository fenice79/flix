import React from 'react';
import { TVShow, tmdb } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

interface TVShowRowProps {
  title: string;
  shows: TVShow[];
}

export default function TVShowRow({ title, shows }: TVShowRowProps) {
  const navigate = useNavigate();

  const handleShowClick = (show: TVShow) => {
    navigate(`/tv/${show.id}`, { state: { show } });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {shows.map((show) => (
            <div 
              key={show.id} 
              className="flex-none w-64 transition-transform hover:scale-105 cursor-pointer"
              onClick={() => handleShowClick(show)}
            >
              <img
                src={tmdb.getImageUrl(show.poster_path, 'w500')}
                alt={show.name}
                className="rounded-md w-full h-96 object-cover"
                loading="lazy"
              />
              <div className="mt-2">
                <h3 className="text-sm text-white font-medium">{show.name}</h3>
                <p className="text-xs text-gray-400">
                  {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}