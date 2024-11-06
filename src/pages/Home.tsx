import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import MovieRow from '../components/MovieRow';
import { Movie, tmdb } from '../services/tmdb';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          tmdb.getTrending(),
          tmdb.getPopular(),
          tmdb.getTopRated(),
          tmdb.getUpcoming()
        ]);

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroCarousel />
      <div className="relative z-10 -mt-32">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular on ProtoFlix" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRatedMovies} />
        <MovieRow title="Upcoming" movies={upcomingMovies} />
      </div>
    </div>
  );
}