import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Info } from 'lucide-react';
import { Movie, TVShow, tmdb } from '../services/tmdb';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = (Movie | TVShow) & { media_type: 'movie' | 'tv' };

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchContent = async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await tmdb.search(query);
        setResults(searchResults as SearchResult[]);
      } catch (err) {
        setError('Si è verificato un errore durante la ricerca. Riprova più tardi.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchContent, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.media_type === 'movie') {
      navigate(`/watch/${result.id}`);
    } else {
      navigate(`/watch/tv/${result.id}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-zinc-900 shadow-xl rounded-lg">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca film o serie TV..."
              className="w-full bg-transparent text-white text-xl px-6 py-4 focus:outline-none border-b border-zinc-800"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {error ? (
              <div className="p-4 text-center text-red-400">{error}</div>
            ) : isLoading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-pulse">Ricerca in corso...</div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {results.map((result) => (
                  <div
                    key={`${result.media_type}-${result.id}`}
                    className="group relative cursor-pointer rounded-md overflow-hidden"
                    onClick={() => handleResultClick(result)}
                  >
                    <img
                      src={tmdb.getImageUrl(result.poster_path, 'w500')}
                      alt={result.title || (result as TVShow).name}
                      className="w-full h-full object-cover rounded-md transform group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 p-4 flex flex-col justify-end">
                      <h3 className="text-white font-bold text-lg">
                        {result.title || (result as TVShow).name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResultClick(result);
                          }}
                        >
                          <Play className="w-4 h-4" />
                          Play
                        </button>
                        <button 
                          className="flex items-center gap-1 bg-gray-600/70 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/details/${result.media_type}/${result.id}`);
                            onClose();
                          }}
                        >
                          <Info className="w-4 h-4" />
                          Info
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-400">
                Nessun risultato trovato per "{query}"
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">
                Inizia a digitare per cercare
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}