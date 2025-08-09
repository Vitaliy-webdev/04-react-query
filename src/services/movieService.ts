import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const SEARCH_ENDPOINT = '/search/movie';
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

export const getMovies = async (query: string, page: number): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>(`${BASE_URL}${SEARCH_ENDPOINT}`, {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  return response.data; 
};

