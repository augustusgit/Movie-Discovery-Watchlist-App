import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Movie } from '../types';
import { HeartIcon } from './HeartIcon';

interface MovieCardProps {
  movie: Movie;
  onWatchlistPress: () => void;
  inWatchlist?: boolean;
  showWatchlistButton?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = memo(({ 
  movie, 
  onWatchlistPress, 
  inWatchlist = false,
  showWatchlistButton = true,
}) => {
  return (
    <View className="flex-row bg-white mx-4 my-2 rounded-lg shadow-md overflow-hidden">
      <View className="relative">
        <Image
          source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster' }}
          className="w-24 h-36 bg-gray-100"
          resizeMode="cover"
        />
        {inWatchlist && (
          <View className="absolute top-2 right-2 bg-green-500 px-1.5 py-1 rounded">
            <Text className="text-white text-xs font-semibold">✓ Saved</Text>
          </View>
        )}
      </View>
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
            {movie.Title}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">{movie.Year}</Text>
        </View>
        {showWatchlistButton && (
          <TouchableOpacity
            className={`flex-row items-center justify-center py-2 px-3 rounded-lg mt-1 ${
              inWatchlist ? 'bg-red-500' : 'bg-blue-500'
            }`}
            onPress={onWatchlistPress}
            activeOpacity={0.7}
          >
            <HeartIcon filled={inWatchlist} size={18} color="#ffffff" />
            <Text className="text-white text-sm font-semibold ml-2">
              {inWatchlist ? 'Remove' : 'Save'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.movie.imdbID === nextProps.movie.imdbID &&
    prevProps.inWatchlist === nextProps.inWatchlist &&
    prevProps.showWatchlistButton === nextProps.showWatchlistButton &&
    prevProps.movie.Title === nextProps.movie.Title &&
    prevProps.movie.Year === nextProps.movie.Year &&
    prevProps.movie.Poster === nextProps.movie.Poster
  );
});

MovieCard.displayName = 'MovieCard';