import React, { useEffect, useState } from 'react';
import { TVShow, TV_GENRES, tmdb } from '../services/tmdb';
import TVShowRow from '../components/TVShowRow';
import Navbar from '../components/Navbar';

export default function Series() {
  const [popularShows, setPopularShows] = useState<TVShow[]>([]);
  const [topRatedShows, setTopRatedShows] = useState<TVShow[]>([]);
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [genreShows, setGenreShows] = useState<{ [key: number]: TVShow[] }>({});

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const [popular, topRated, trending] = await Promise.all([
          tmdb.getPopularTVShows(),
          tmdb.getTopRatedTVShows(),
          tmdb.getTrendingTVShows()
        ]);

        setPopularShows(popular);
        setTopRatedShows(topRated);
        setTrendingShows(trending);

        // Fetch shows for selected genres
        const selectedGenres = [10765, 18, 27, 10759]; // Sci-Fi & Fantasy, Drama, Horror, Action & Adventure
        const genrePromises = selectedGenres.map(genreId => 
          tmdb.getTVByGenre(genreId).then(shows => ({ genreId, shows }))
        );

        const genreResults = await Promise.all(genrePromises);
        const genreShowsMap = genreResults.reduce((acc, { genreId, shows }) => {
          acc[genreId] = shows;
          return acc;
        }, {} as { [key: number]: TVShow[] });

        setGenreShows(genreShowsMap);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchTVShows();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <TVShowRow title="Serie TV Popolari" shows={popularShows} />
        <TVShowRow title="Serie TV Più Votate" shows={topRatedShows} />
        <TVShowRow title="Serie TV del Momento" shows={trendingShows} />
        {Object.entries(genreShows).map(([genreId, shows]) => (
          <TVShowRow
            key={genreId}
            title={`${TV_GENRES[Number(genreId)] || 'Genere'}`}
            shows={shows}
          />
        ))}
      </div>
    </div>
  );
}