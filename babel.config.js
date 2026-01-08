// module.exports = {
//   presets: [
//     'module:@react-native/babel-preset',
//     'nativewind/babel',
//   ],
// };

// module.exports = {
//   presets: [
//     ['module:metro-react-native-babel-preset', { jsxImportSource: 'nativewind' }],
//     'nativewind/babel',
//   ],
// };
// babel.config.js


// module.exports = {
//   presets: [
//     ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
//     'nativewind/babel',
//   ],
//   plugins: [
//     'react-native-reanimated/plugin', // Required peer dependency
//   ],
// };
module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  plugins: [
    // [
    //   // 'react-native-reanimated/plugin',
    //   // {
    //   //   relativeSourceLocation: true, // Prevents absolute path build errors
    //   // },
    // ],
    // 'react-native-worklets/plugin', // Add this as the last plugin
    'react-native-reanimated/plugin', // Must be last
  ],
};
