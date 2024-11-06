import axios from 'axios';

const TMDB_API_KEY = 'b49aca963e138d27a696c047e7ab345d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

export const MOVIE_GENRES = {
  28: 'Azione',
  12: 'Avventura',
  16: 'Animazione',
  35: 'Commedia',
  80: 'Crime',
  99: 'Documentario',
  18: 'Drammatico',
  10751: 'Famiglia',
  14: 'Fantasy',
  36: 'Storico',
  27: 'Horror',
  10402: 'Musica',
  9648: 'Mistero',
  10749: 'Romantico',
  878: 'Fantascienza',
  10770: 'Film TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Western'
};

export const TV_GENRES = {
  10759: 'Azione & Avventura',
  16: 'Animazione',
  35: 'Commedia',
  80: 'Crime',
  99: 'Documentario',
  18: 'Drammatico',
  10751: 'Famiglia',
  10762: 'Kids',
  9648: 'Mistero',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'Guerra & Politica',
  37: 'Western'
};

export const tmdb = {
  apiKey: TMDB_API_KEY,
  
  getImageUrl: (path: string | null, size: 'original' | 'w500' | 'w780' = 'original') => 
    path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder-image.jpg',

  getTrending: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending:', error);
      return [];
    }
  },

  getPopular: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular:', error);
      return [];
    }
  },

  getTopRated: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching top rated:', error);
      return [];
    }
  },

  getUpcoming: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching upcoming:', error);
      return [];
    }
  },

  getPopularTVShows: async (): Promise<TVShow[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      return [];
    }
  },

  getTopRatedTVShows: async (): Promise<TVShow[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      return [];
    }
  },

  getTrendingTVShows: async (): Promise<TVShow[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      return [];
    }
  },

  getTVByGenre: async (genreId: number): Promise<TVShow[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=it-IT&with_genres=${genreId}&sort_by=popularity.desc`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching TV shows by genre:', error);
      return [];
    }
  },

  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=it-IT&with_genres=${genreId}&sort_by=popularity.desc`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  },

  search: async (query: string): Promise<(Movie | TVShow)[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=it-IT&query=${encodeURIComponent(query)}&page=1`
      );
      return response.data.results.filter((item: any) => 
        (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
      );
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },

  getMovieDetails: async (movieId: number): Promise<Movie & { runtime: number; genres: { id: number; name: string; }[] }> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getTVDetails: async (tvId: number): Promise<TVShow & { episode_run_time: number[]; genres: { id: number; name: string; }[] }> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=it-IT`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  }
};