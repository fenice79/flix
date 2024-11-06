import axios from 'axios';
import { config } from '../config';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function getVideoMetadata(tmdbId: number) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${tmdbId}?api_key=${config.tmdbApiKey}`
    );
    
    return {
      tmdbId,
      title: response.data.title,
      overview: response.data.overview,
      posterPath: response.data.poster_path,
      backdropPath: response.data.backdrop_path,
      releaseDate: response.data.release_date
    };
  } catch (error) {
    throw new Error('Errore nel recupero dei metadata da TMDB');
  }
}