import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
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

  const handleRemoveFromWatchlist = async (movie: Movie) => {
    try {
      await removeFromWatchlist(movie.imdbID);
      setWatchlist(prev => prev.filter(m => m.imdbID !== movie.imdbID));
      Alert.alert('Success', `${movie.Title} removed from watchlist`);
    } catch (err) {
      Alert.alert('Error', 'Failed to remove from watchlist');
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => {
    return (
      <MovieCard
        movie={item}
        onWatchlistPress={() => handleRemoveFromWatchlist(item)}
        inWatchlist={true}
        showWatchlistButton={true}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading watchlist...</Text>
      </View>
    );
  }

  if (watchlist.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Your watchlist is empty</Text>
        <Text style={styles.emptySubtext}>
          Add movies from the Movies tab to see them here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Watchlist</Text>
      <FlatList
        data={watchlist}
        renderItem={renderMovie}
        keyExtractor={item => item.imdbID}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});