// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);


// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// const config = mergeConfig(getDefaultConfig(__dirname), {
//   /* Your existing custom config here */
// });

// // Pass the path to your global CSS file as the input
// module.exports = withNativeWind(config, { input: './global.css' });
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

let config = mergeConfig(getDefaultConfig(__dirname), {
  // your other config
});

// Wrap in both NativeWind and Reanimated
module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: './global.css' })
);
