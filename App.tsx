/**
 * Movie Discovery App
 * Browse trending movies and save them to a local Watchlist
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MovieListScreen } from './screens/MovieListScreen';
import { WatchlistScreen } from './screens/WatchlistScreen';

const Tab = createBottomTabNavigator();

// Simple icon component for tabs
const TabIcon: React.FC<{ label: string; focused: boolean }> = ({ label, focused }) => {
  const iconMap: Record<string, string> = {
    Movies: '🎬',
    Watchlist: '⭐',
  };
  
  return (
    <View className="items-center justify-center">
      <Text className="text-xl">{iconMap[label] || '•'}</Text>
    </View>
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen 
            name="Movies" 
            component={MovieListScreen}
            options={{
              tabBarLabel: 'Movies',
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Movies" focused={focused} />
              ),
            }}
          />
          <Tab.Screen 
            name="Watchlist" 
            component={WatchlistScreen}
            options={{
              tabBarLabel: 'Watchlist',
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Watchlist" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
