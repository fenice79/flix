import React from 'react';
import { X, Star, Clock, Calendar, Play } from 'lucide-react';
import { tmdb } from '../services/tmdb';

interface TVShowModalProps {
  show: any;
  onClose: () => void;
  onPlay?: () => void;
}

export default function TVShowModal({ show, onClose, onPlay }: TVShowModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black/80" onClick={onClose} />

        <div className="relative z-50 w-full max-w-4xl p-6 mx-auto bg-zinc-900 rounded-lg shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img
                src={tmdb.getImageUrl(show.poster_path, 'w500')}
                alt={show.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold text-white mb-4">{show.name}</h2>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  <Star className="w-5 h-5 mr-1" />
                  <span>{show.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{show.episode_run_time?.[0] || '?'} min/ep</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-1" />
                  <span>{new Date(show.first_air_date).getFullYear()}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{show.overview}</p>

              {onPlay && (
                <button
                  onClick={onPlay}
                  className="flex items-center px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition mb-6"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Riproduci
                </button>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Stagioni: </span>
                  <span className="text-white">{show.number_of_seasons}</span>
                </div>
                <div>
                  <span className="text-gray-400">Episodi totali: </span>
                  <span className="text-white">{show.number_of_episodes}</span>
                </div>
                <div>
                  <span className="text-gray-400">Stato: </span>
                  <span className="text-white">{show.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Generi: </span>
                  <span className="text-white">
                    {show.genres?.map((genre: any) => genre.name).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Lingue: </span>
                  <span className="text-white">
                    {show.spoken_languages?.map((lang: any) => lang.name).join(', ')}
                  </span>
                </div>
                {show.production_companies && show.production_companies.length > 0 && (
                  <div>
                    <span className="text-gray-400">Produzione: </span>
                    <span className="text-white">
                      {show.production_companies.map((company: any) => company.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}