import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onWatchlistPress: () => void;
  inWatchlist?: boolean;
  showWatchlistButton?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onWatchlistPress, 
  inWatchlist = false,
  showWatchlistButton = true,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster' }}
          style={styles.poster}
          resizeMode="cover"
        />
        {inWatchlist && (
          <View style={styles.watchlistBadge}>
            <Text style={styles.watchlistText}>✓ Saved</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.year}>{movie.Year}</Text>
        {showWatchlistButton && (
          <TouchableOpacity
            style={[styles.button, inWatchlist && styles.removeButton]}
            onPress={onWatchlistPress}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    width: 100,
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  watchlistBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  watchlistText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});