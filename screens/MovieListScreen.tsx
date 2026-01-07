import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../navigation/types';
import { Movie } from '../types';
import { fetchMovies } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../services/watchlist';

type NavigationProp = BottomTabNavigationProp<RootTabParamList, 'Movies'>;

export const MovieListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMovies();
  }, []);

  // Refresh watchlist status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (movies.length > 0) {
        loadWatchlistStatus(movies);
      }
    }, [movies])
  );

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMovies('Marvel');
      const movieList = response.Search || [];
      setMovies(movieList);
      
      // Load watchlist status after movies are loaded
      if (movieList.length > 0) {
        await loadWatchlistStatus(movieList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlistStatus = async (movieList: Movie[]) => {
    const ids = new Set<string>();
    for (const movie of movieList) {
      const inWatchlist = await isInWatchlist(movie.imdbID);
      if (inWatchlist) {
        ids.add(movie.imdbID);
      }
    }
    setWatchlistIds(ids);
  };

  const handleMoviePress = async (movie: Movie) => {
    const inWatchlist = watchlistIds.has(movie.imdbID);
    
    try {
      if (inWatchlist) {
        await removeFromWatchlist(movie.imdbID);
        setWatchlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(movie.imdbID);
          return newSet;
        });
        Alert.alert('Success', `${movie.Title} removed from watchlist`);
      } else {
        await addToWatchlist(movie);
        setWatchlistIds(prev => new Set(prev).add(movie.imdbID));
        Alert.alert(
          'Success',
          `${movie.Title} added to watchlist`,
          [
            {
              text: 'OK',
              style: 'default',
            },
            {
              text: 'View Watchlist',
              style: 'default',
              onPress: () => navigation.navigate('Watchlist'),
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update watchlist');
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => {
    const inWatchlist = watchlistIds.has(item.imdbID);
    
    return (
      <MovieCard 
        movie={item} 
        onWatchlistPress={() => handleMoviePress(item)}
        inWatchlist={inWatchlist}
        showWatchlistButton={true}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={loadMovies}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No movies found</Text>
        <Text style={styles.retryText} onPress={loadMovies}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movie Search</Text>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={item => item.imdbID}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  list: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});