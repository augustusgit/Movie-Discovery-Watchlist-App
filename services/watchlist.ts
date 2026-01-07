import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types';

const WATCHLIST_KEY = '@movie_watchlist';

export const getWatchlist = async (): Promise<Movie[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATCHLIST_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (movie: Movie): Promise<void> => {
  try {
    const watchlist = await getWatchlist();
    const exists = watchlist.some(m => m.imdbID === movie.imdbID);
    
    if (!exists) {
      watchlist.push(movie);
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (imdbID: string): Promise<void> => {
  try {
    const watchlist = await getWatchlist();
    const filtered = watchlist.filter(m => m.imdbID !== imdbID);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const isInWatchlist = async (imdbID: string): Promise<boolean> => {
  try {
    const watchlist = await getWatchlist();
    return watchlist.some(m => m.imdbID === imdbID);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};