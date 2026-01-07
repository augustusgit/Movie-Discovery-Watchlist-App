import { MovieSearchResponse } from '../types';

const API_KEY = '302e1397';
const BASE_URL = 'https://www.omdbapi.com';

export const fetchMovies = async (searchTerm: string = 'Marvel'): Promise<MovieSearchResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: MovieSearchResponse = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'No movies found');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};