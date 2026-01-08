# Movie Discovery & Watchlist App


### Features
API integration — Fetches movies from OMDb API using the provided endpoint
Movie display — FlatList shows movies with:
Title
Year
Poster image
Loading state — ActivityIndicator (Spinner) while fetching
Error state — Error message with retry option if the API fails or returns no results

1. Dedicated button shows "Save" or "Remove" with heart icon
Each movie card has a button that says "Add to Watchlist" or "Remove from Watchlist"
Button styling indicates the current state (blue for add, red for remove)
Badge shows "✓ Saved" for movies in the watchlist
2. Separate Watchlist screen
Created WatchlistScreen.tsx showing all saved movies
Pull-to-refresh support
Empty state message when the watchlist is empty
Movies can be removed from this screen
3. Tab navigation
Bottom tab navigation with two tabs:
Movies tab: Browse and add movies
Watchlist tab: View saved movies
Navigation implemented using React Navigation
4. AsyncStorage persistence
Watchlist data is saved using AsyncStorage
Automatically persists across app restarts
Watchlist loads when the app reopens
5. Screen synchronization
Watchlist screen reloads when you navigate to it
Movies screen updates watchlist status when you return to it
Changes in one screen reflect in the other

Testing persistence
To verify persistence:
Add movies to your watchlist
Close the app completely (kill the process)
Reopen the app
Navigate to the Watchlist tab
Your saved movies should still be there
The watchlist persists using AsyncStorage, so it survives app restarts and device reboots (until the app is uninstalled or data is cleared).

Unique
- Pull-to-refresh
Swipe down on the movie list to refresh
Visual feedback during refresh
- Empty states
Watchlist: improved design with tips
Search: helpful message when no results
- Performance
React.memo prevents unnecessary component re-renders
useMemo memoizes expensive computations and JSX
useCallback memoizes event handlers
Optimized FlatList rendering
- Search
Search bar at the top of Movie Search screen
Real-time search with debouncing
Search any movie title (not just "Marvel")
Smooth transitions between search results
The app is optimized and provides a smooth user experience.



## Build and run your app

### This project was Setup and developed manually with React Native CLI not Expo

```sh
# Using npm
npx react-native run-ios
npx react-native run-android
```

### Here is link to completed android app
https://drive.google.com/file/d/1bh8Q4k6-n2c5st0S2EpT4bwHwo9MGpnW/view?usp=sharing