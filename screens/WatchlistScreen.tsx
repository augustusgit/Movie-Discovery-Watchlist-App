import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Movie } from '../types';
import { getWatchlist, removeFromWatchlist } from '../services/watchlist';
import { MovieCard } from '../components/MovieCard';

export const WatchlistScreen: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      const movies = await getWatchlist();
      setWatchlist(movies);
    } catch (err) {
      Alert.alert('Error', 'Failed to load watchlist');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload watchlist whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [loadWatchlist])
  );

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWatchlist();
  }, []);

  const handleRemoveFromWatchlist = useCallback(async (movie: Movie) => {
    try {
      await removeFromWatchlist(movie.imdbID);
      setWatchlist(prev => prev.filter(m => m.imdbID !== movie.imdbID));
      Alert.alert('Success', `${movie.Title} removed from watchlist`);
    } catch (err) {
      Alert.alert('Error', 'Failed to remove from watchlist');
    }
  }, []);

  // Memoize renderMovie to prevent unnecessary re-renders
  const renderMovie = useCallback(({ item }: { item: Movie }) => {
    return (
      <MovieCard
        movie={item}
        onWatchlistPress={() => handleRemoveFromWatchlist(item)}
        inWatchlist={true}
        showWatchlistButton={true}
      />
    );
  }, [handleRemoveFromWatchlist]);

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: Movie) => item.imdbID, []);

  // Memoize empty state component
  const renderEmptyState = useMemo(() => (
    <View className="flex-1 justify-center items-center p-5 bg-gray-50">
      <View className="items-center mb-6">
        <Text className="text-6xl mb-4">⭐</Text>
        <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
          No movies saved yet!
        </Text>
        <Text className="text-base text-gray-600 text-center px-8">
          Start exploring and save your favorite movies to your watchlist
        </Text>
      </View>
      <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-8">
        <Text className="text-sm text-blue-800 text-center">
          💡 Tip: Use the search bar in the Movies tab to find movies you want to watch
        </Text>
      </View>
    </View>
  ), []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-gray-50">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-3 text-base text-gray-600">Loading watchlist...</Text>
      </View>
    );
  }

  if (watchlist.length === 0) {
    return renderEmptyState;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-2xl font-bold p-4 bg-white text-gray-800">My Watchlist</Text>
      <FlatList
        data={watchlist}
        renderItem={renderMovie}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};