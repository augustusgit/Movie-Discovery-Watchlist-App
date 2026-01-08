import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  TouchableOpacity,
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('Marvel');
  const [searchInput, setSearchInput] = useState<string>('Marvel');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadMovies(searchQuery);
  }, [searchQuery]);

  // Refresh watchlist status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (movies.length > 0) {
        loadWatchlistStatus(movies);
      }
    }, [movies])
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadMovies = useCallback(async (searchTerm: string = 'Marvel') => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMovies(searchTerm);
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
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMovies(searchQuery);
  }, [searchQuery, loadMovies]);

  const handleSearch = useCallback((text: string) => {
    setSearchInput(text);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search - wait 500ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      const trimmedQuery = text.trim() || 'Marvel';
      setSearchQuery(trimmedQuery);
    }, 500);
  }, []);

  const loadWatchlistStatus = useCallback(async (movieList: Movie[]) => {
    const ids = new Set<string>();
    for (const movie of movieList) {
      const inWatchlist = await isInWatchlist(movie.imdbID);
      if (inWatchlist) {
        ids.add(movie.imdbID);
      }
    }
    setWatchlistIds(ids);
  }, []);

  const handleMoviePress = useCallback(async (movie: Movie) => {
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
  }, [watchlistIds, navigation]);

  // Memoize renderMovie to prevent unnecessary re-renders
  const renderMovie = useCallback(({ item }: { item: Movie }) => {
    const inWatchlist = watchlistIds.has(item.imdbID);
    
    return (
      <MovieCard 
        movie={item} 
        onWatchlistPress={() => handleMoviePress(item)}
        inWatchlist={inWatchlist}
        showWatchlistButton={true}
      />
    );
  }, [watchlistIds, handleMoviePress]);

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: Movie) => item.imdbID, []);

  // Memoize empty state components
  const renderLoadingState = useMemo(() => (
    <View className="flex-1 justify-center items-center p-5 bg-gray-50">
      <ActivityIndicator size="large" color="#007AFF" />
      <Text className="mt-3 text-base text-gray-600">Loading movies...</Text>
    </View>
  ), []);

  const renderErrorState = useMemo(() => (
    <View className="flex-1 justify-center items-center p-5 bg-gray-50">
      <Text className="text-base text-red-600 text-center mb-3">Error: {error}</Text>
      <TouchableOpacity onPress={() => loadMovies(searchQuery)}>
        <Text className="text-sm text-blue-500 underline">Tap to retry</Text>
      </TouchableOpacity>
    </View>
  ), [error, searchQuery, loadMovies]);

  const renderEmptyState = useMemo(() => (
    <View className="flex-1 justify-center items-center p-5 bg-gray-50">
      <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
        No movies found
      </Text>
      <Text className="text-sm text-gray-600 text-center mb-4">
        Try searching for a different movie title
      </Text>
      <TouchableOpacity 
        onPress={() => loadMovies(searchQuery)}
        className="bg-blue-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white font-semibold">Retry</Text>
      </TouchableOpacity>
    </View>
  ), [searchQuery, loadMovies]);

  if (loading && !refreshing) {
    return renderLoadingState;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white">
        <Text className="text-2xl font-bold p-4 text-gray-800">Movie Search</Text>
        <View className="px-4 pb-4">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Text className="text-gray-500 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Search for movies..."
              placeholderTextColor="#9ca3af"
              value={searchInput}
              onChangeText={handleSearch}
              returnKeyType="search"
              onSubmitEditing={() => {
                const trimmedQuery = searchInput.trim() || 'Marvel';
                setSearchQuery(trimmedQuery);
              }}
            />
          </View>
        </View>
      </View>
      
      {error ? (
        renderErrorState
      ) : movies.length === 0 ? (
        renderEmptyState
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};